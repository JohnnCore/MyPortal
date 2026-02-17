// src/hooks/board/useBoardDnD.ts
import {
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { DraggableItem, UseBoardDnDProps, UseBoardDnDReturn } from '../types/ui';

export const useBoardDnD = <T extends DraggableItem>({
  items,
  statuses,
  onReorder,
}: UseBoardDnDProps<T>): UseBoardDnDReturn<T> => {
  const [localItems, setLocalItems] = useState<T[]>(items);
  const [activeItem, setActiveItem] = useState<T | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    statusId: number;
    index: number;
  } | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Keep local items synced with external data
  useEffect(() => {
    const sorted = [...items].sort((a, b) =>
      a.statusId === b.statusId ? (a.order ?? 0) - (b.order ?? 0) : a.statusId - b.statusId
    );
    setLocalItems(sorted);
  }, [items]);

  // Group items by status
  const itemsByStatus = useMemo(() => {
    const grouped: Record<number, T[]> = {};
    localItems.forEach((item) => {
      if (!grouped[item.statusId]) grouped[item.statusId] = [];
      grouped[item.statusId].push(item);
    });
    return grouped;
  }, [localItems]);

  // DnD Handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = event.active.id;
      const found = localItems.find((i) => i.id === id) ?? null;
      setActiveItem(found);
      setDropIndicator(null);
    },
    [localItems]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!active || !over) return setDropIndicator(null);

      const targetStatusId = Number(over.data.current?.statusId);
      const overId = over.id;

      const targetItems = localItems
        .filter((i) => i.statusId === targetStatusId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const overIndex = targetItems.findIndex((i) => i.id === overId);
      setDropIndicator({
        statusId: targetStatusId,
        index: overIndex === -1 ? targetItems.length : overIndex,
      });
    },
    [localItems]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);
      setDropIndicator(null);

      if (!over || !onReorder) return;
      const moved = localItems.find((i) => i.id === active.id);
      if (!moved) return;

      const targetStatusId = Number(over.data.current?.statusId);
      const targetItems = localItems
        .filter((i) => i.statusId === targetStatusId)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      const overIndex = targetItems.findIndex((i) => i.id === over.id);
      const finalIndex = overIndex === -1 ? targetItems.length : overIndex;

      if (moved.statusId === targetStatusId && targetItems[finalIndex]?.id === moved.id) return;

      await onReorder?.({ ...moved, statusId: targetStatusId }, finalIndex);
    },
    [localItems, onReorder]
  );

  const dndContextProps: UseBoardDnDReturn<T>['dndContextProps'] = {
    sensors,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDragEnd: handleDragEnd,
  };

  return {
    dndContextProps,
    itemsByStatus,
    activeItem,
    dropIndicator,
    statuses,
  };
};
