import { apiSlice } from '../apiSlice';
import { RTKQ_TAGS } from '../../../utils/constants';
import type { AcceptInviteDTO, ApiResponse, CreateInviteDTO, ProjectInvite } from '../../../types';

const PROJECT_INVITES_URL = '/invites/projects';

// --- Types

const projectInvitesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create an invite for a project
    createProjectInvite: builder.mutation<ApiResponse<ProjectInvite>, CreateInviteDTO>({
      query: ({ projectId, email, expiresDays, maxUses }) => ({
        url: `${PROJECT_INVITES_URL}/${projectId}`,
        method: 'POST',
        body: { email, expiresDays, maxUses },
      }),
      invalidatesTags: [RTKQ_TAGS.invites],
    }),

    // Accept an invite token
    acceptInvite: builder.mutation<ApiResponse<{ projectId: number }>, AcceptInviteDTO>({
      query: ({ token }) => ({
        url: `${PROJECT_INVITES_URL}/accept/${token}`,
        method: 'POST',
      }),
      invalidatesTags: [RTKQ_TAGS.invites],
    }),

    // List invites for a project
    listProjectInvites: builder.query<ApiResponse<ProjectInvite[]>, { projectId: string }>({
      query: ({ projectId }) => ({
        url: `${PROJECT_INVITES_URL}/${projectId}`,
        method: 'GET',
      }),
      providesTags: (result, _error, arg) =>
        result?.data
          ? result.data.map((inv) => ({ type: RTKQ_TAGS.invites, id: inv.id }))
          : [{ type: RTKQ_TAGS.invites, id: arg.projectId }],
    }),
  }),
});

export const {
  useCreateProjectInviteMutation,
  useAcceptInviteMutation,
  useListProjectInvitesQuery,
} = projectInvitesApiSlice;
