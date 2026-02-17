export const storyTypes = ['issue', 'bug', 'fix', 'feature', 'task'] as const;

export type StoryType = (typeof storyTypes)[number];

export interface Story {
  id: string;
  title: string;
  type: string;
  description?: string;
}

export interface BoardStatus {
  id: string;
  name: string;
}

export interface ProjectFormContextType {
  currentStep: number;
  projectName: string;
  setProjectName: (name: string) => void;
  projectKey: string;
  setProjectKey: (key: string) => void;
  stories: Story[];
  addStory: (story: Omit<Story, 'id'>) => void;
  removeStory: (id: string) => void;
  boardStatuses: BoardStatus[];
  addStatus: (name: string) => void;
  removeStatus: (id: string) => void;
  reorderStatuses: (fromIndex: number, toIndex: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}
