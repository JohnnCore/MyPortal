import { apiSlice } from '../apiSlice';
import { metaApiSlice } from '../Meta/metaApiSlice';
import { RTKQ_TAGS } from '../../../utils/constants';
import type {
  PaginatedResponse,
  IssueWithRelations,
  GetIssuesQueryParams,
  GetIssuesCursorParams,
  CursorPaginatedResponse,
  CreateIssueDTO,
  UpdateIssueDTO,
  DeleteIssueDTO,
  ReorderIssuesDTO,
  CommentWithUser,
  GetCommentsParams,
  CreateCommentDTO,
  ApiResponse,
  GetIssueParams,
  Tag,
} from '../../../types';
import type { RootState } from '../../store';

const ISSUES_URL = '/issues/projects';

export const issuesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all issues for a project
    getIssues: builder.query<PaginatedResponse<IssueWithRelations>, GetIssuesQueryParams>({
      query: ({
        projectId,
        search,
        assigneeIds,
        statusIds,
        typeIds,
        priorityIds,
        page,
        pageSize,
      }) => ({
        url: `${ISSUES_URL}/${projectId}`,
        params: {
          search,
          assigneeIds: assigneeIds?.join(','),
          statusIds: statusIds?.join(','),
          typeIds: typeIds?.join(','),
          priorityIds: priorityIds?.join(','),
          page,
          pageSize,
        },
      }),
      providesTags: (result) => {
        if (!result?.data) {
          return [{ type: RTKQ_TAGS.issues, id: 'LIST' }];
        }

        return [
          { type: RTKQ_TAGS.issues, id: 'LIST' },
          ...result.data
            .filter((item) => item?.id) // Filter out any invalid items
            .map((item) => ({ type: RTKQ_TAGS.issues, id: item.id })),
        ];
      },
      keepUnusedDataFor: 5 * 60, // Cache for 5 minutes
    }),

    // Get issues with cursor-based pagination (infinite scroll)
    getIssuesInfinite: builder.query<
      CursorPaginatedResponse<IssueWithRelations>,
      GetIssuesCursorParams
    >({
      query: ({
        projectId,
        limit = 20,
        cursor,
        search,
        assigneeIds,
        statusIds,
        typeIds,
        priorityIds,
      }) => ({
        url: `${ISSUES_URL}/${projectId}`,
        params: {
          limit,
          cursor: cursor || undefined,
          search,
          assigneeIds: assigneeIds?.join(','),
          statusIds: statusIds?.join(','),
          typeIds: typeIds?.join(','),
          priorityIds: priorityIds?.join(','),
        },
      }),
      // Use serializeQueryArgs to exclude cursor from the cache key.
      // This way all pages for the same projectId + filters share the same cache entry.
      serializeQueryArgs: ({ queryArgs }) => {
        const { ...rest } = queryArgs;
        return rest;
      },
      // Transform response to normalize both offset and cursor pagination responses
      transformResponse: (
        response:
          | CursorPaginatedResponse<IssueWithRelations>
          | PaginatedResponse<IssueWithRelations>
      ): CursorPaginatedResponse<IssueWithRelations> => {
        const data = response.data ?? [];

        // If it's already cursor pagination format (has hasMore), return as-is
        if ('pagination' in response && response.pagination && 'hasMore' in response.pagination) {
          return response as CursorPaginatedResponse<IssueWithRelations>;
        }

        // Otherwise, convert offset pagination to cursor format
        // For initial load without cursor, backend returns offset pagination
        const paginatedResponse = response as PaginatedResponse<IssueWithRelations>;
        const hasNextPage = paginatedResponse.pagination?.has_next_page ?? false;

        // Build cursor from the last item if there are more pages
        let nextCursor: string | null = null;
        if (hasNextPage && data.length > 0) {
          const lastItem = data[data.length - 1];
          // Encode cursor as base64 JSON with createdAt and id
          const cursorPayload = {
            createdAt: lastItem.createdAt,
            id: lastItem.id,
          };
          nextCursor = btoa(JSON.stringify(cursorPayload));
        }

        return {
          status: 'success',
          data,
          pagination: {
            nextCursor,
            hasMore: hasNextPage,
          },
        };
      },
      // Merge incoming pages into existing cache
      merge: (currentCache, newItems, { arg }) => {
        // If no cursor was provided (first page), replace entirely
        if (!arg.cursor) {
          return newItems;
        }

        // Append new items, avoiding duplicates by ID
        const existingIds = new Set(currentCache.data.map((item) => item.id));
        const uniqueNewItems = newItems.data.filter((item) => !existingIds.has(item.id));

        // If no new unique items, just return current with updated pagination
        if (uniqueNewItems.length === 0) {
          return {
            ...currentCache,
            pagination: newItems.pagination,
          };
        }

        return {
          ...newItems,
          data: [...currentCache.data, ...uniqueNewItems],
        };
      },
      // Force refetch when filters or projectId change (but not cursor)
      forceRefetch: ({ currentArg, previousArg }) => {
        if (!previousArg || !currentArg) return false;
        // Refetch if anything except cursor changed
        const { ...currRest } = currentArg;
        const { ...prevRest } = previousArg;
        return JSON.stringify(currRest) !== JSON.stringify(prevRest);
      },
      providesTags: (result) => {
        if (!result?.data) {
          return [{ type: RTKQ_TAGS.issues, id: 'INFINITE_LIST' }];
        }
        return [
          { type: RTKQ_TAGS.issues, id: 'INFINITE_LIST' },
          ...result.data
            .filter((item) => item?.id)
            .map((item) => ({ type: RTKQ_TAGS.issues, id: item.id })),
        ];
      },
      keepUnusedDataFor: 5 * 60,
    }),

    // Get issue by ID
    getIssueById: builder.query<ApiResponse<IssueWithRelations>, GetIssueParams>({
      query: ({ id, projectId }) => ({ url: `${ISSUES_URL}/${projectId}/${id}` }),
      providesTags: (_result, _error, { id }) => [{ type: RTKQ_TAGS.issues, id }],
    }),

    // Create new issue
    createIssue: builder.mutation<ApiResponse<IssueWithRelations>, CreateIssueDTO>({
      query: (newIssue) => ({
        url: `${ISSUES_URL}/${newIssue.projectId}`,
        method: 'POST',
        body: newIssue,
      }),
      async onQueryStarted(newIssue, { dispatch, queryFulfilled }) {
        const patchResults: Array<{ undo: () => void }> = [];

        const projectId = Number(newIssue?.projectId ?? 0);
        const tempId = Date.now() * -1;

        const optimistic = {
          ...newIssue,
          id: tempId,
        } as IssueWithRelations;

        // Optimistically update issues
        const patchResult = dispatch(
          issuesApiSlice.util.updateQueryData('getIssues', { projectId }, (draft) => {
            if (!draft?.data) return;
            draft.data.unshift(optimistic);
          })
        );

        patchResults.push(patchResult);

        // Optimistically update tags if new tags were created
        let tagsPatchResult: { undo: () => void } | undefined;
        if (newIssue.tags && Array.isArray(newIssue.tags)) {
          const newTags = newIssue.tags.filter(
            (tag): tag is Tag => typeof tag.id === 'number' && tag.id < 0
          );
          if (newTags.length > 0) {
            tagsPatchResult = dispatch(
              metaApiSlice.util.updateQueryData(
                'getProjectTags',
                { projectId },
                (draft: PaginatedResponse<Tag>) => {
                  if (!draft?.data) return;
                  // Add new tags to the beginning of the list
                  draft.data.unshift(...newTags);
                }
              )
            );
            patchResults.push(tagsPatchResult);
          }
        }

        try {
          const { data: response } = await queryFulfilled;

          // Replace temporary issue with real server response
          dispatch(
            issuesApiSlice.util.updateQueryData('getIssues', { projectId }, (draft) => {
              if (!draft?.data) return;
              const idx = draft.data.findIndex((i) => i.id === tempId);
              if (idx !== -1) {
                if (response?.data) {
                  draft.data[idx] = response.data;
                }
              } else if (response?.data) {
                draft.data.unshift(response.data);
              }
            })
          );

          // Update tags with server-provided IDs if any were created
          if (response?.data?.tags && tagsPatchResult) {
            const serverTags = response.data.tags.filter(
              (tag): tag is Tag => typeof tag.id === 'number' && tag.id > 0
            );
            if (serverTags.length > 0) {
              dispatch(
                metaApiSlice.util.updateQueryData(
                  'getProjectTags',
                  { projectId },
                  (draft: PaginatedResponse<Tag>) => {
                    if (!draft?.data) return;
                    // Replace temp tags with server tags
                    const newTags =
                      newIssue.tags?.filter(
                        (tag): tag is Tag => typeof tag.id === 'number' && tag.id < 0
                      ) || [];
                    newTags.forEach((tempTag, index) => {
                      const tempIndex = draft.data.findIndex((t: Tag) => t.id === tempTag.id);
                      if (tempIndex !== -1 && serverTags[index]) {
                        draft.data[tempIndex] = serverTags[index];
                      }
                    });
                  }
                )
              );
            }
          }
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      // invalidatesTags: [{ type: RTKQ_TAGS.issues, id: "LIST" }],
    }),

    createIssueCard: builder.mutation<ApiResponse<IssueWithRelations>, CreateIssueDTO>({
      query: (newIssue) => ({
        url: `${ISSUES_URL}/${newIssue.projectId}`,
        method: 'POST',
        body: newIssue,
      }),
      async onQueryStarted(newIssue, { dispatch, queryFulfilled }) {
        const projectId = Number(newIssue?.projectId ?? 0);
        const tempId = Date.now() * -1;

        const optimistic = {
          ...newIssue,
          id: tempId,
        } as IssueWithRelations;

        // Optimistically update issues
        const patchResult = dispatch(
          issuesApiSlice.util.updateQueryData('getIssues', { projectId }, (draft) => {
            if (!draft?.data) return;
            // Insert at end of target status column or at start
            draft.data.unshift(optimistic);
          })
        );

        // Optimistically update tags if new tags were created
        let tagsPatchResult;
        if (newIssue.tags && Array.isArray(newIssue.tags)) {
          const newTags = newIssue.tags.filter(
            (tag): tag is Tag => typeof tag.id === 'number' && tag.id < 0
          );
          if (newTags.length > 0) {
            tagsPatchResult = dispatch(
              metaApiSlice.util.updateQueryData('getProjectTags', { projectId }, (draft) => {
                if (!draft?.data) return;
                // Add new tags to the beginning of the list
                draft.data.unshift(...newTags);
              })
            );
          }
        }

        try {
          const { data: response } = await queryFulfilled;
          // dispatch(
          //   issuesApiSlice.util.updateQueryData('getIssues', { projectId }, (draft) => {
          //     if (!draft?.data) return;
          //     const idx = draft.data.findIndex((i) => i.id === tempId);
          //     if (idx !== -1 && response?.data) {
          //       draft.data[idx] = response.data;
          //     } else if (response?.data) {
          //       draft.data.unshift(response.data);
          //     }
          //   })
          // );

          dispatch(
            issuesApiSlice.util.updateQueryData('getIssues', { projectId }, (draft) => {
              if (!draft?.data) return;
              const idx = draft.data.findIndex((i) => i.id === tempId);
              if (idx !== -1 && response?.data) {
                draft.data[idx] = response.data;
              } else if (response?.data) {
                const existsWithRealId = draft.data.some((i) => i.id === response?.data?.id);
                if (!existsWithRealId) {
                  draft.data.unshift(response.data);
                }
              }
            })
          );

          // Update tags with server-provided IDs if any were created
          if (response?.data?.tags && tagsPatchResult) {
            const serverTags = response.data.tags.filter(
              (tag): tag is Tag => typeof tag.id === 'number' && tag.id > 0
            );
            if (serverTags.length > 0) {
              dispatch(
                metaApiSlice.util.updateQueryData(
                  'getProjectTags',
                  { projectId },
                  (draft: PaginatedResponse<Tag>) => {
                    if (!draft?.data) return;
                    // Replace temp tags with server tags
                    const newTags =
                      newIssue.tags?.filter(
                        (tag): tag is Tag => typeof tag.id === 'number' && tag.id < 0
                      ) || [];
                    newTags.forEach((tempTag, index) => {
                      const tempIndex = draft.data.findIndex((t: Tag) => t.id === tempTag.id);
                      if (tempIndex !== -1 && serverTags[index]) {
                        draft.data[tempIndex] = serverTags[index];
                      }
                    });
                  }
                )
              );
            }
          }
        } catch {
          patchResult.undo();
          tagsPatchResult?.undo();
        }
      },
      // invalidatesTags: [{ type: RTKQ_TAGS.issues, id: "LIST" }],
    }),

    // Update issue
    updateIssue: builder.mutation<ApiResponse<IssueWithRelations>, UpdateIssueDTO>({
      query: ({ id, ...updatedFields }) => ({
        url: `${ISSUES_URL}/${updatedFields.projectId}/${id}`,
        method: 'PUT',
        body: updatedFields,
      }),
      async onQueryStarted({ id, ...updatedFields }, { dispatch, queryFulfilled }) {
        const projectId = (updatedFields.projectId as number) || 0;

        // Optimistically update cache for the specific issue
        const patchResult = dispatch(
          issuesApiSlice.util.updateQueryData('getIssueById', { id, projectId }, (draft) => {
            if (!draft?.data) return;
            const issue = draft.data;
            if (issue) {
              Object.assign(issue, updatedFields);
            }
          })
        );

        // Also update the cache for the list of issues
        const patchListResult = dispatch(
          issuesApiSlice.util.updateQueryData('getIssues', { projectId }, (draft) => {
            if (!draft?.data) return;
            const idx = draft.data.findIndex((i) => i.id === id);
            if (idx !== -1) {
              Object.assign(draft.data[idx], updatedFields);
            }
          })
        );

        // Optimistically update tags if new tags were created
        let tagsPatchResult: { undo: () => void } | undefined;
        if (updatedFields.tags && Array.isArray(updatedFields.tags)) {
          const newTags = updatedFields.tags.filter(
            (tag): tag is Tag => typeof tag.id === 'number' && tag.id < 0
          );
          if (newTags.length > 0) {
            tagsPatchResult = dispatch(
              metaApiSlice.util.updateQueryData(
                'getProjectTags',
                { projectId },
                (draft: PaginatedResponse<Tag>) => {
                  if (!draft?.data) return;
                  // Only add tags that don't already exist
                  newTags.forEach((newTag) => {
                    const exists = draft.data.some(
                      (existingTag: Tag) =>
                        existingTag.id === newTag.id ||
                        existingTag.name.toLowerCase() === (newTag.name?.toLowerCase() ?? '')
                    );
                    if (!exists) {
                      draft.data.unshift(newTag);
                    }
                  });
                }
              )
            );
          }
        }

        try {
          const { data: response } = await queryFulfilled;

          // Update tags with server-provided IDs if any were created
          if (response?.data?.tags && tagsPatchResult) {
            const serverTags = response.data.tags.filter(
              (tag): tag is Tag => typeof tag.id === 'number' && tag.id > 0
            );
            const newTags =
              updatedFields.tags?.filter(
                (tag): tag is Tag => typeof tag.id === 'number' && tag.id < 0
              ) || [];

            if (serverTags.length > 0 && newTags.length > 0) {
              dispatch(
                metaApiSlice.util.updateQueryData(
                  'getProjectTags',
                  { projectId },
                  (draft: PaginatedResponse<Tag>) => {
                    if (!draft?.data) return;
                    // Replace temp tags with server tags
                    newTags.forEach((tempTag, index) => {
                      const tempIndex = draft.data.findIndex((t: Tag) => t.id === tempTag.id);
                      if (tempIndex !== -1 && serverTags[index]) {
                        draft.data[tempIndex] = serverTags[index];
                      }
                    });
                  }
                )
              );
            }
          }
        } catch {
          patchResult.undo(); // Rollback if server rejects update
          patchListResult.undo(); // Rollback list update if server rejects
          tagsPatchResult?.undo(); // Rollback tag updates if server rejects
        }
      },

      // Backup invalidation in case cached issue does not exist in list
      // invalidatesTags: (result, error, { id }) => [
      //     { type: RTKQ_TAGS.issues, id },
      // ],
    }),

    // Delete issue
    deleteIssue: builder.mutation<ApiResponse<null>, DeleteIssueDTO>({
      query: ({ id, projectId }) => ({
        url: `${ISSUES_URL}/${projectId}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: RTKQ_TAGS.issues, id },
        { type: RTKQ_TAGS.issues, id: 'LIST' },
      ],
    }),

    reorderIssue: builder.mutation<ApiResponse<null>, ReorderIssuesDTO>({
      query: ({ id, statusId, newIndex, projectId }) => ({
        url: `${ISSUES_URL}/${projectId}/reorder`,
        method: 'POST',
        body: { issueId: id, statusId, newIndex, projectId },
      }),
      async onQueryStarted({ id, statusId, newIndex, projectId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          issuesApiSlice.util.updateQueryData('getIssues', { projectId: projectId }, (draft) => {
            if (!draft?.data) return;

            // Find the issue being moved
            const movedIssue = draft.data.find((i) => i.id === id);
            if (!movedIssue) return;

            // Update the status of the moved issue
            movedIssue.statusId = statusId;

            // Get all issues in the target status column (including the moved one)
            const issuesInTargetStatus = draft.data
              .filter((i) => i.statusId === statusId)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

            // Remove the moved issue from the array
            const withoutMoved = issuesInTargetStatus.filter((i) => i.id !== id);

            // Insert the moved issue at the new index
            withoutMoved.splice(newIndex, 0, movedIssue);

            // Update the order property for all issues in this status
            withoutMoved.forEach((issue, idx) => {
              issue.order = idx;
            });

            // Update the main draft.data array with the new order values
            draft.data = draft.data.map((issue) => {
              const updatedIssue = withoutMoved.find((i) => i.id === issue.id);
              return updatedIssue || issue;
            });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    getIssueComments: builder.query<PaginatedResponse<CommentWithUser>, GetCommentsParams>({
      query: ({ issueId, projectId }) => ({
        url: `${ISSUES_URL}/${projectId}/${issueId}/comments`,
        params: {}, // RTK Query will handle serialization
      }),
      providesTags: (result) => {
        if (!result?.data) {
          return [{ type: RTKQ_TAGS.comments, id: 'LIST' }];
        }

        return [
          { type: RTKQ_TAGS.comments, id: 'LIST' },
          ...result.data
            .filter((item) => item?.id) // Filter out any invalid items
            .map((item) => ({ type: RTKQ_TAGS.comments, id: item.id })),
        ];
      },
      keepUnusedDataFor: 5 * 60, // Cache for 5 minutes
    }),

    // Create new comment
    createComment: builder.mutation<ApiResponse<CommentWithUser>, CreateCommentDTO>({
      query: ({ content, issueId, projectId }) => ({
        url: `${ISSUES_URL}/${projectId}/${issueId}/comments`,
        method: 'POST',
        body: { issueId, content },
      }),
      async onQueryStarted(
        { content, issueId, projectId },
        { dispatch, queryFulfilled, getState }
      ) {
        const tempId = -Math.abs(crypto.getRandomValues(new Uint32Array(1))[0]);

        // Create optimistic comment
        const state = getState() as RootState;

        const optimisticComment: CommentWithUser = {
          id: tempId,
          content,
          issueId,
          userId: state?.auth?.user?.id ?? 0,
          user: state?.auth?.user || undefined, // Ensure user object is available for UI
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Optimistically update comments cache
        const patchResult = dispatch(
          issuesApiSlice.util.updateQueryData(
            'getIssueComments',
            { issueId, projectId },
            (draft) => {
              if (!draft?.data) {
                draft.data = [];
              }
              draft.data.push(optimisticComment);
            }
          )
        );

        try {
          const { data: serverResponse } = await queryFulfilled;

          // Extract the actual comment from the server response
          // Server returns {status: 'success', data: Comment, message: 'Comment created'}
          const actualComment: CommentWithUser = serverResponse?.data ?? optimisticComment;

          // Replace temp comment with server response
          dispatch(
            issuesApiSlice.util.updateQueryData(
              'getIssueComments',
              { issueId, projectId },
              (draft) => {
                if (!draft?.data) return;
                const idx = draft.data.findIndex((c) => c.id === tempId);
                if (idx !== -1 && actualComment) {
                  draft.data[idx] = actualComment;
                }
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
      // invalidatesTags: [{ type: RTKQ_TAGS.comments, id: "LIST" }],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssuesInfiniteQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useCreateIssueCardMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useReorderIssueMutation,
  useGetIssueCommentsQuery,
  useCreateCommentMutation,
} = issuesApiSlice;
