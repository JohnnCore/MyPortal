import { ROOT } from '../../../routes/paths';

export interface MenuItem {
  label: string;
  url: string;
  icon?: string; // For future icon support
  disabled?: boolean;
  badge?: number; // For notification counts
}

export const menu: MenuItem[] = [
  { label: 'Projects', url: ROOT },
  { label: 'Boards', url: '/boards' },
  { label: 'Filters', url: '/filters' },
  { label: 'Dashboards', url: '/dashboards' },
  { label: 'Goals', url: '/goals' },
  { label: 'Teams', url: '/teams' },
  { label: 'Customize', url: '/customize' },
];
