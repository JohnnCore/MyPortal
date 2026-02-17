import { skipToken } from '@reduxjs/toolkit/query';
import {
  useGetProjectByIdQuery,
  useGetProjectsQuery,
  useGetProjectMembersQuery,
} from '../../redux/api/Projects/projectsApiSlice';

// Local type for query params (matches backend-friendly params)
export type GetProjectsParams = {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

// export const useProject = (id: number) => {
//     const { data, isFetching, isError, error, isSuccess } = useGetProjectByIdQuery(id);
//     return { data, isFetching, isError, error, isSuccess };
// }

interface UseProjectProps {
  id: number | null;
}

export const useProject = ({ id }: UseProjectProps) => {
  const valid = typeof id === 'number' && id > 0;

  return useGetProjectByIdQuery(valid ? id : skipToken, {
    selectFromResult: (result) => ({
      ...result,
      projects: result.data ?? null,
    }),
  });
};

export const useProjects = (params: GetProjectsParams = {}) => {
  return useGetProjectsQuery(params, {
    selectFromResult: (result) => ({
      ...result,
      projects: result.data?.data ?? [],
      total: result.data?.pagination?.total_count ?? result.data?.total ?? 0,
      page: result.data?.pagination?.current_page ?? result.data?.page ?? 1,
      pageSize: result.data?.pagination?.per_page ?? result.data?.pageSize ?? params.limit ?? 10,
    }),
  });
};

export const useProjectMembers = (projectId: number | null) => {
  const valid = typeof projectId === 'number' && projectId > 0;

  return useGetProjectMembersQuery(valid ? { projectId } : skipToken, {
    selectFromResult: (result) => ({
      ...result,
      projectMembers: result.data?.data ?? [],
    }),
  });
};
