// hooks/Meta/useMetaData.ts
import { useMemo } from 'react';
import { useMetaTypes, useMetaStatuses, useMetaPriorities, useGetProjectTags } from './useMeta';
import { useProjects } from '../Projects/useProject';
import type { MetaResponse } from '../../types';

interface UseMetaDataProps {
  projectId: number | null;
}

export interface MetaData {
  priorities: MetaResponse[];
  statuses: MetaResponse[];
  types: MetaResponse[];
  tags: MetaResponse[];
}

export const useMetaData = ({ projectId }: UseMetaDataProps) => {
  // Only call meta hooks if projectId is valid
  const validProjectId = projectId ?? 0; // 0 will be treated as invalid inside hooks

  const { types, isLoading: typesLoading } = useMetaTypes({ projectId: validProjectId });
  const { statuses, isLoading: statusesLoading } = useMetaStatuses({ projectId: validProjectId });
  const { priorities, isLoading: prioritiesLoading } = useMetaPriorities({
    projectId: validProjectId,
  });
  const { tags, isLoading: tagsLoading } = useGetProjectTags({ projectId: validProjectId });
  const { projects, isLoading: projectsLoading } = useProjects();

  const isLoading =
    typesLoading || statusesLoading || prioritiesLoading || projectsLoading || tagsLoading;

  const metaData: MetaData = useMemo(
    () => ({
      types: types ?? [],
      statuses: statuses ?? [],
      priorities: priorities ?? [],
      projects: projects ?? [],
      tags: tags ?? [],
    }),
    [types, statuses, priorities, projects, tags]
  );

  return {
    metaData,
    isLoading,
    // Expose individual items if needed
    types,
    statuses,
    priorities,
    tags,
    projects,
  };
};
