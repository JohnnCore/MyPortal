import React from 'react';
import { DraggableItem } from '../../../types';

export interface SortableCardProps<T extends DraggableItem> {
  item: T;
  statusId: number;
  children: React.ReactNode;
}
