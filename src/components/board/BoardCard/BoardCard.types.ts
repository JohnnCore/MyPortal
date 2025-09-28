import type { IssueResponse } from "../../../types/board";

export interface BoardCardProps {
  item: IssueResponse;
  onClick?: (issue: IssueResponse) => void;

  // onDragStart?: (event: React.DragEvent<HTMLDivElement>, itemId: string) => void;
  // onDragEnd?: (event: React.DragEvent<HTMLDivElement>) => void;
  // onClick?: (itemId: string) => void;
}
