import { apiSlice } from '../apiSlice';
import { RTKQ_TAGS } from '../../../utils/constants';
import type {
  ApiResponse,
  CreateProjectDTO,
  GetProjectFilterParams,
  GetProjectMembersParams,
  PaginatedResponse,
  ProjectWithRelations,
  UpdateProjectDTO,
  UserSafe,
} from '../../../types';

const PROJECT_URL = '/projects';

const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects
    getProjects: builder.query<PaginatedResponse<ProjectWithRelations>, GetProjectFilterParams>({
      query: (params) => ({ url: PROJECT_URL, params }),
      providesTags: (result) => {
        // Safe tag generation with proper null checks
        if (!result?.data) {
          return [{ type: RTKQ_TAGS.projects, id: 'LIST' }];
        }

        const dataArray = Array.isArray(result.data) ? result.data : [result.data];

        return [
          { type: RTKQ_TAGS.projects, id: 'LIST' },
          ...dataArray
            .filter((item) => item?.id)
            .map((item) => ({ type: RTKQ_TAGS.projects, id: item.id })),
        ];
      },
      keepUnusedDataFor: 5 * 60, // Cache for 5 minutes
    }),

    // Get project by ID
    getProjectById: builder.query<ApiResponse<ProjectWithRelations>, number>({
      query: (id) => ({ url: `${PROJECT_URL}/${id}` }),
      providesTags: (_result, _error, id) => [{ type: RTKQ_TAGS.projects, id }],
    }),

    // Create new project
    createProject: builder.mutation<ApiResponse<ProjectWithRelations>, CreateProjectDTO>({
      query: (newProject) => ({
        url: `${PROJECT_URL}`,
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: [{ type: RTKQ_TAGS.projects, id: 'LIST' }],
    }),

    // Update project
    updateProject: builder.mutation<ApiResponse<ProjectWithRelations>, UpdateProjectDTO>({
      query: ({ id, ...updatedFields }) => ({
        url: `${PROJECT_URL}/${id}`,
        method: 'PUT',
        body: updatedFields,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: RTKQ_TAGS.projects, id },
        { type: RTKQ_TAGS.projects, id: 'LIST' }, // Also refresh list
      ],
    }),

    // Delete project
    deleteProject: builder.mutation<void, number>({
      query: (id) => ({
        url: `${PROJECT_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: RTKQ_TAGS.projects, id },
        { type: RTKQ_TAGS.projects, id: 'LIST' },
      ],
    }),

    getProjectMembers: builder.query<PaginatedResponse<UserSafe>, GetProjectMembersParams>({
      query: ({ projectId }) => ({
        url: `${PROJECT_URL}/members/${projectId}`,
      }),
      providesTags: (_result, _error, { projectId }) => [
        { type: RTKQ_TAGS.users, id: 'LIST' },
        { type: RTKQ_TAGS.users, id: projectId },
      ],
      keepUnusedDataFor: 5 * 60, // Cache for 5 minutes (more dynamic than types/statuses)
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
} = projectsApiSlice;
