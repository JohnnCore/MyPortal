import { memo } from 'react';
import GenericBoardCard from './GenericBoardCard';
import { TaskIcon } from '../../common/Icons/IssueIcons';
import { BoardCardProps } from './BoardCard.types';

const BoardCard = memo(
  ({ item, onClick }: BoardCardProps) => {
    const Icon = TaskIcon;

    return (
      <GenericBoardCard
        item={item}
        title={item.title}
        description={item.description}
        renderIcon={() => <Icon />}
        onClick={onClick}
      />
    );
  },
  // Custom comparison: only re-render if these specific fields change
  (prevProps, nextProps) => {
    const prev = prevProps.item;
    const next = nextProps.item;

    return (
      prev.id === next.id &&
      prev.title === next.title &&
      prev.description === next.description &&
      prev.statusId === next.statusId &&
      prev.typeId === next.typeId &&
      prevProps.onClick === nextProps.onClick
    );
  }
);

BoardCard.displayName = 'BoardCard';

export default BoardCard;
