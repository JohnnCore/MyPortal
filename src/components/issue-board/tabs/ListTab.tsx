import IssuesList from '../IssuesList/IssuesList';
import type { TabContentProps } from './tabsConfig';

export default function ListTab({ projectId, filters }: TabContentProps) {
  return <IssuesList projectId={projectId} filters={filters} />;
}
