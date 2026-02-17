import Board from '../../board/Board/Board';
import BoardCard from '../../board/BoardCard/BoardCard';
import { useBoardDnD } from '../../../hooks/useBoardDnD';
import { Link, useLocation } from 'react-router';
import { parseId } from '../../../utils/parseId';
import type { IssueResponse } from '../../../types';
import type { TabContentProps } from './tabsConfig';

export default function BoardTab({
  issues,
  statuses,
  types,
  priorities,
  onReorder,
  isLoading = false,
  onRenameStatus,
  onReorderStatus,
  onCreateCard,
  projectId,
}: TabContentProps) {
  const handleReorderAdapter = onReorder
    ? (item: IssueResponse, newIndex: number) => {
        const projectIdNumber = parseId(projectId);
        if (!projectIdNumber) return;

        return onReorder(
          {
            id: item.id,
            statusId: item.statusId,
            newIndex,
            projectId: projectIdNumber,
          },
          newIndex
        );
      }
    : undefined;

  const { dndContextProps, itemsByStatus, activeItem, dropIndicator } = useBoardDnD<IssueResponse>({
    items: issues,
    statuses,
    onReorder: handleReorderAdapter,
  });

  const location = useLocation();

  const renderCard = (issue: IssueResponse) => (
    <Link to={`?selectedIssue=${issue.id}`} state={{ background: location }}>
      <BoardCard item={issue} />
    </Link>
  );

  return (
    <Board<IssueResponse>
      dndContextProps={dndContextProps}
      itemsByStatus={itemsByStatus}
      statuses={statuses}
      types={types}
      priorities={priorities}
      activeItem={activeItem}
      dropIndicator={dropIndicator}
      renderCard={renderCard}
      emptyStateMessage="No issues yet. Drag one here!"
      isLoading={isLoading}
      onRenameStatus={onRenameStatus}
      onReorderStatus={onReorderStatus}
      onCreateCard={onCreateCard}
    />
  );
}
