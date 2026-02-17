import React, { memo, useCallback } from 'react';
import { useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { BoardProps, DraggableItem, StatusColumn } from '../../../types/ui';
import BoardColumn from '../BoardColumn/BoardColumn';
import SortableCard from '../BoardCard/SortableCard';
import CreateCardInput from './CreateCardInput/CreateCardInput';

// Wrapper for sortable status columns
const SortableStatusColumn = ({
  status,
  children,
}: {
  status: StatusColumn;
  children: React.ReactNode;
}) => {
  const { setNodeRef, transform, transition, isDragging, attributes, listeners } = useSortable({
    id: status.id,
    data: { type: 'status' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Clone children and pass dragHandleProps
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(
        child as React.ReactElement<{ dragHandleProps?: Record<string, unknown> }>,
        {
          dragHandleProps: { ...attributes, ...listeners },
        }
      );
    }
    return child;
  });

  return (
    <div ref={setNodeRef} style={style}>
      {childrenWithProps}
    </div>
  );
};

const Board = <T extends DraggableItem>({
  itemsByStatus,
  statuses,
  types,
  priorities,
  activeItem,
  activeStatus,
  dropIndicator,
  statusDropIndicatorIndex,
  dndContextProps,
  statusDndContextProps,
  renderCard,
  emptyStateMessage = 'No items yet',
  dropIndicatorClassName = 'h-0.5 bg-blue-500 rounded-full my-1 transition-all duration-150',
  isLoading = false,
  onRenameStatus,
  onReorderStatus,
  onCreateCard,
}: BoardProps<T>) => {
  const dropIndicatorIndex = statusDropIndicatorIndex;
  const [hoveredStatus, setHoveredStatus] = useState<number | null>(null);
  const [createStatus, setCreateStatus] = useState<number | null>(null);
  const [newCardTitle, setNewCardTitle] = useState<string>('');
  const [newCardTypeId, setNewCardTypeId] = useState<number>(types?.[0]?.id);
  const [newCardPriorityId, setNewCardPriorityId] = useState<number>(priorities?.[0]?.id);
  const createInputRef = useRef<HTMLDivElement | null>(null);

  // Close input on outside click, but preserve text
  useEffect(() => {
    if (createStatus === null) return;
    function handleClick(e: MouseEvent) {
      if (createInputRef.current && !createInputRef.current.contains(e.target as Node)) {
        setCreateStatus(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [createStatus]);

  // When opening create input, ensure default type is selected
  useEffect(() => {
    if (createStatus !== null) {
      setNewCardTypeId((prev) => prev ?? types?.[0]?.id ?? null);
      setNewCardPriorityId((prev) => prev ?? priorities?.[0]?.id ?? null);
    }
  }, [createStatus, types, priorities]);

  // Handlers for CreateCardInput
  const handleSaveCard = useCallback(
    (statusId: number) => {
      if (newCardTitle.trim()) {
        onCreateCard?.({
          title: newCardTitle.trim(),
          statusId,
          typeId: newCardTypeId,
          priorityId: newCardPriorityId,
        });
        setNewCardTitle('');
        setCreateStatus(null);
      }
    },
    [newCardTitle, newCardTypeId, newCardPriorityId, onCreateCard]
  );

  const handleCancelCreate = useCallback(() => {
    setNewCardTitle('');
    setCreateStatus(null);
  }, []);

  const handleKeyDown = useCallback(
    (statusId: number) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && newCardTitle.trim()) {
        handleSaveCard(statusId);
      } else if (e.key === 'Escape') {
        handleCancelCreate();
      }
    },
    [newCardTitle, handleSaveCard, handleCancelCreate]
  );

  const boardContent = (
    <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 items-stretch h-full">
      {statuses.map((status, statusIndex) => {
        const columnItems = itemsByStatus[status.id] ?? [];
        const isEmpty = columnItems.length === 0;

        return (
          <React.Fragment key={status.id}>
            {/* Status drop indicator */}
            {statusDndContextProps && dropIndicatorIndex === statusIndex && (
              <div className="w-1 bg-blue-500 rounded-full self-stretch" />
            )}

            <SortableContext items={columnItems.map((i) => i.id)} strategy={rectSortingStrategy}>
              <SortableStatusColumn status={status}>
                <div
                  onMouseEnter={() => setHoveredStatus(status.id)}
                  onMouseLeave={() => setHoveredStatus(null)}
                  className="relative h-full"
                >
                  <BoardColumn
                    status={status}
                    count={columnItems.length}
                    onRename={onRenameStatus}
                    onMoveLeft={
                      statusIndex > 0
                        ? () => {
                            onReorderStatus?.(status.id, statusIndex - 1);
                          }
                        : undefined
                    }
                    onMoveRight={
                      statusIndex < statuses.length - 1
                        ? () => {
                            onReorderStatus?.(status.id, statusIndex + 1);
                          }
                        : undefined
                    }
                    canMoveLeft={statusIndex > 0}
                    canMoveRight={statusIndex < statuses.length - 1}
                  >
                    {/* Item cards */}
                    {isEmpty && !isLoading && createStatus !== status.id ? (
                      <div className="flex items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">
                        {emptyStateMessage}
                      </div>
                    ) : (
                      !isLoading &&
                      columnItems.map((item, index) => (
                        <React.Fragment key={item.id}>
                          {dropIndicator?.statusId === status.id &&
                            dropIndicator?.index === index && (
                              <div className={dropIndicatorClassName} />
                            )}
                          <SortableCard item={item} statusId={status.id}>
                            {renderCard(item)}
                          </SortableCard>
                        </React.Fragment>
                      ))
                    )}

                    {dropIndicator?.statusId === status.id &&
                      dropIndicator?.index === columnItems.length && (
                        <div className={dropIndicatorClassName} />
                      )}

                    {/* + Create button and new card input below all cards */}
                    <div className="mt-2">
                      {createStatus === status.id ? (
                        <SortableCard
                          item={{ id: 'new', statusId: status.id }}
                          statusId={status.id}
                        >
                          <CreateCardInput
                            ref={(el) => {
                              if (el) {
                                createInputRef.current = el;
                              }
                            }}
                            title={newCardTitle}
                            onTitleChange={setNewCardTitle}
                            typeId={newCardTypeId}
                            onTypeChange={setNewCardTypeId}
                            priorityId={newCardPriorityId}
                            onPriorityChange={setNewCardPriorityId}
                            types={types}
                            priorities={priorities}
                            onSave={() => handleSaveCard(status.id)}
                            onCancel={handleCancelCreate}
                            onKeyDown={handleKeyDown(status.id)}
                          />
                        </SortableCard>
                      ) : (
                        hoveredStatus === status.id && (
                          <button
                            className="w-full px-3 py-1 bg-blue-600 text-white text-xs rounded shadow hover:bg-blue-700 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              // If already in create mode for another column, move the input and preserve text
                              setCreateStatus((prev) => {
                                if (prev !== null && prev !== status.id) {
                                  return status.id;
                                }
                                return status.id;
                              });
                              setNewCardTitle((prev) => {
                                // If switching columns, keep the text
                                return prev;
                              });
                            }}
                          >
                            + Create
                          </button>
                        )
                      )}
                    </div>
                  </BoardColumn>
                </div>
              </SortableStatusColumn>
            </SortableContext>
          </React.Fragment>
        );
      })}

      {/* Final drop indicator after all columns */}
      {statusDndContextProps && dropIndicatorIndex === statuses.length && (
        <div className="w-1 bg-blue-500 rounded-full self-stretch" />
      )}
    </div>
  );

  // Wrap in both status DnD (outer) and issue DnD (inner) contexts if provided
  return statusDndContextProps ? (
    <DndContext {...statusDndContextProps}>
      <SortableContext items={statuses.map((s) => s.id)} strategy={rectSortingStrategy}>
        <DndContext {...dndContextProps}>
          {boardContent}

          {createPortal(
            <DragOverlay>
              {activeItem ? (
                <div className="scale-105 shadow-lg opacity-90">{renderCard(activeItem)}</div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </SortableContext>

      {createPortal(
        <DragOverlay>
          {activeStatus ? (
            <div className="scale-105 shadow-lg opacity-90 min-w-70">
              <BoardColumn
                status={activeStatus}
                count={itemsByStatus[activeStatus.id]?.length ?? 0}
              >
                <div className="text-gray-400 text-sm p-4">Moving column...</div>
              </BoardColumn>
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  ) : (
    <DndContext {...dndContextProps}>
      {boardContent}

      {createPortal(
        <DragOverlay>
          {activeItem ? (
            <div className="scale-105 shadow-lg opacity-90">{renderCard(activeItem)}</div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default memo(Board) as typeof Board;
