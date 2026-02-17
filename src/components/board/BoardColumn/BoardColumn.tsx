import { memo, useCallback } from 'react';

import { useDroppable } from '@dnd-kit/core';

import BoardColumnEditor from './BoardColumnEditor';
import { BoardColumnProps } from './BoardColumn.types';

const BoardColumn = memo(
  ({
    status,
    children,
    count,
    isLoading = false,
    onRename,
    onMoveLeft,
    onMoveRight,
    canMoveLeft,
    canMoveRight,
  }: BoardColumnProps) => {
    const { setNodeRef } = useDroppable({
      id: `column-${status.id}`,
      data: { statusId: status.id },
    });

    const handleRename = useCallback(
      (statusId: number, newName: string) => {
        if (onRename) {
          onRename(statusId, newName);
        }
      },
      [onRename]
    ); // Add onRename as a dependency

    return (
      <section
        ref={setNodeRef}
        className="min-w-70 max-w-87.5 p-4 rounded-lg bg-gray-100 dark:bg-column-background h-full flex flex-col"
        data-status-id={status.id}
      >
        <BoardColumnEditor
          status={status}
          count={count}
          onSave={handleRename}
          onMoveLeft={onMoveLeft}
          onMoveRight={onMoveRight}
          canMoveLeft={canMoveLeft}
          canMoveRight={canMoveRight}
        />

        <div className="space-y-3 min-h-12.5 relative flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-400"></div>
            </div>
          ) : (
            children
          )}
        </div>
      </section>
    );
  }
);

BoardColumn.displayName = 'BoardColumn';
export default BoardColumn;
