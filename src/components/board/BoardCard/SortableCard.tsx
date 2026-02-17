// src/components/board/BoardCard/SortableCard.tsx
import React from 'react';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import { DraggableItem } from '../../../types';
import { SortableCardProps } from './SortableCard.types';

const SortableCard = <T extends DraggableItem>({
  item,
  statusId,
  children,
}: SortableCardProps<T>) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { statusId },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 150ms ease',
    cursor: 'grab',
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default SortableCard;
