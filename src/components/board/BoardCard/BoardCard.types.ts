import type { IssueResponse } from '../../../types';

export interface BoardCardProps {
  item: IssueResponse;
  onClick?: (item: IssueResponse) => void;
}
