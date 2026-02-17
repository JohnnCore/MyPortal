import { apiSlice } from '../apiSlice';
import { RTKQ_TAGS } from '../../../utils/constants';
import type {
  PaginatedResponse,
  GetMetaQueryParams,
  IssueType,
  IssueStatus,
  ApiResponse,
  RenameIssueStatusDTO,
  ReorderIssueStatusDTO,
  CreateIssueStatusDTO,
  IssuesPriority,
  Tag,
  CreateTagDTO,
} from '../../../types';

const META_URL = '/meta';

const metaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get issue types (bug, task, etc.)
    getTypes: builder.query<PaginatedResponse<IssueType>, GetMetaQueryParams>({
      query: ({ projectId }) => ({ url: `${META_URL}/types/${projectId}` }),
      providesTags: (_result, _error, { projectId }) => [
        { type: RTKQ_TAGS.types, id: 'LIST' },
        { type: RTKQ_TAGS.types, id: projectId },
      ],
      keepUnusedDataFor: 60 * 60, // Cache for 1 hour (rarely changes)
    }),

    // Get issue statuses (todo, in progress, done, etc.)
    getStatuses: builder.query<PaginatedResponse<IssueStatus>, GetMetaQueryParams>({
      query: ({ projectId }) => ({ url: `${META_URL}/statuses/${projectId}` }),

      providesTags: (_result, _error, { projectId }) => [
        { type: RTKQ_TAGS.status, id: 'LIST' },
        { type: RTKQ_TAGS.status, id: projectId },
      ],
      keepUnusedDataFor: 60 * 60, // Cache for 1 hour
    }),

    renameStatuses: builder.mutation<ApiResponse<IssueStatus>, RenameIssueStatusDTO>({
      query: ({ projectId, id, status }) => ({
        url: `${META_URL}/projects/${projectId}/statuses`,
        method: 'PUT',
        body: { statusId: id, status },
      }),

      // Optimistic update starts here
      async onQueryStarted({ projectId, id, status }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          metaApiSlice.util.updateQueryData(
            'getStatuses', // The name of the query endpoint
            { projectId }, // The same query params used for caching
            (draft) => {
              if (draft?.data) {
                const statusItem = draft.data.find((s) => s.id === id);
                if (statusItem) {
                  statusItem.name = status; // apply optimistic name change
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // revert if the mutation fails
        }
      },

      // Invalidate cache to ensure fresh data later
      // invalidatesTags: (result, error, { projectId }) => [
      //     { type: RTKQ_TAGS.status, id: "LIST" },
      //     { type: RTKQ_TAGS.status, id: projectId },
      // ],
    }),

    // Create a new status
    createStatus: builder.mutation<ApiResponse<IssueStatus>, CreateIssueStatusDTO>({
      query: ({ name, projectId }) => ({
        url: `${META_URL}/statuses/create/${projectId}`,
        method: 'POST',
        body: { name },
      }),
      // Invalidate status list to refetch
      // invalidatesTags: (result, error, { projectId }) => [
      //     { type: RTKQ_TAGS.status, id: "LIST" },
      //     { type: RTKQ_TAGS.status, id: projectId },
      // ],
    }),

    // Reorder status columns
    reorderStatus: builder.mutation<
      ApiResponse<{ status: IssueStatus; updatedStatuses: IssueStatus[] }>,
      ReorderIssueStatusDTO
    >({
      query: ({ projectId, statusId, newIndex }) => ({
        url: `${META_URL}/projects/${projectId}/statuses/reorder`,
        method: 'POST',
        body: { statusId, newIndex },
      }),

      // Optimistic update
      async onQueryStarted({ projectId, statusId, newIndex }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          metaApiSlice.util.updateQueryData('getStatuses', { projectId }, (draft) => {
            if (draft?.data && Array.isArray(draft.data)) {
              const currentIndex = draft.data.findIndex((s) => s.id === statusId);

              if (
                currentIndex !== -1 &&
                currentIndex !== newIndex &&
                newIndex >= 0 &&
                newIndex < draft.data.length
              ) {
                // Remove from current position
                const [movedStatus] = draft.data.splice(currentIndex, 1);
                // Insert at new position
                draft.data.splice(newIndex, 0, movedStatus);

                // Update order field for all statuses to reflect their new positions
                draft.data.forEach((status, index) => {
                  status.order = index;
                });
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Get issue priorities (low, medium, high, etc.)
    getPriorities: builder.query<PaginatedResponse<IssuesPriority>, GetMetaQueryParams>({
      query: ({ projectId }) => ({ url: `${META_URL}/priorities/${projectId}` }),
      providesTags: (_result, _error, { projectId }) => [
        { type: RTKQ_TAGS.priorities, id: 'LIST' },
        { type: RTKQ_TAGS.priorities, id: projectId },
      ],
      keepUnusedDataFor: 60 * 60, // Cache for 1 hour
    }),

    // Get project-specific tags
    getProjectTags: builder.query<PaginatedResponse<Tag>, GetMetaQueryParams>({
      query: ({ projectId, page = 1, pageSize = 50 }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        const queryString = params.toString();
        return {
          url: `${META_URL}/tags/${projectId}${queryString ? `?${queryString}` : ''}`,
        };
      },
      providesTags: (_result, _error, { projectId }) => [
        { type: RTKQ_TAGS.tags, id: 'LIST' },
        { type: RTKQ_TAGS.tags, id: projectId },
      ],
      keepUnusedDataFor: 5 * 60, // Cache for 5 minutes (more dynamic than types/statuses)
    }),

    // Create a new tag
    createTag: builder.mutation<ApiResponse<Tag>, CreateTagDTO>({
      query: ({ name, projectId }) => ({
        url: `${META_URL}/tags/create/${projectId}`,
        method: 'POST',
        body: { name },
      }),
      async onQueryStarted({ name, projectId }, { dispatch, queryFulfilled }) {
        // Optimistic update
        const tempTag: Tag = {
          id: Date.now() * -1, // Temporary negative ID
          name,
        };

        const patchResult = dispatch(
          metaApiSlice.util.updateQueryData('getProjectTags', { projectId }, (draft) => {
            if (!draft?.data) return;
            draft.data.unshift(tempTag);
          })
        );

        try {
          const { data: serverResponse } = await queryFulfilled;
          // Replace temporary tag with server response
          dispatch(
            metaApiSlice.util.updateQueryData('getProjectTags', { projectId }, (draft) => {
              if (!draft?.data) return;
              const idx = draft.data.findIndex((t) => t.id === tempTag.id);
              if (idx !== -1 && serverResponse?.data) {
                draft.data[idx] = serverResponse.data;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export { metaApiSlice };

export const {
  useGetTypesQuery,
  useGetStatusesQuery,
  useRenameStatusesMutation,
  useReorderStatusMutation,
  useCreateStatusMutation,
  useGetPrioritiesQuery,
  useGetProjectTagsQuery,
  useCreateTagMutation,
} = metaApiSlice;
