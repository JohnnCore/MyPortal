export interface HeaderTab {
  id: string;
  label: string;
  path?: string;
  icon?: string;
}

export interface IssueBoardHeaderProps {
  tabs?: HeaderTab[];
  currentTab?: string;
  projectId?: string | number;
}
