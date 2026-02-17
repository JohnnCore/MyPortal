import type { BoardStatus, Story } from '../../../context/ProjectForm/types';

export interface ProjectData {
  name: string;
  projectKey: string;
  stories: Story[];
  boardStatuses: BoardStatus[];
}

export interface ProjectFormWizardProps {
  onSubmit?: (data: ProjectData) => void;
}
