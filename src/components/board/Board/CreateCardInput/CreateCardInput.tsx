import { memo, forwardRef } from 'react';
import Input from '../../../common/Input/Input';
import Select from '../../../common/Select/Select';
import type { CreateCardInputProps } from './CreateCardInput.types';

/**
 * Input form for creating a new card in a board column.
 * Includes title input, type selection, and priority selection.
 */
const CreateCardInput = forwardRef<HTMLDivElement, CreateCardInputProps>(
  (
    {
      title,
      onTitleChange,
      typeId,
      onTypeChange,
      priorityId,
      onPriorityChange,
      types,
      priorities,
      onSave,
      onCancel,
      onKeyDown,
      isDisabled = false,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 p-2" ref={ref}>
        <Input
          type="text"
          className="border rounded px-2 py-1 text-sm w-full"
          placeholder="Enter title..."
          value={title}
          autoFocus
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={onKeyDown}
        />

        {/* Type + Priority dropdown */}
        <div className="flex items-center gap-2 w-full">
          <div className="w-1/2">
            <Select
              label=""
              options={[
                { id: '', name: 'Select type' },
                ...types.map((t) => ({ id: t.id, name: t.name })),
              ]}
              value={typeId ?? ''}
              onChange={(v) => onTypeChange(Number(v))}
              placeholder="Type"
            />
          </div>

          <div className="w-1/2">
            <Select
              label=""
              options={[
                { id: '', name: 'Priority' },
                ...priorities.map((p) => ({ id: p.id, name: p.name })),
              ]}
              value={priorityId ?? ''}
              onChange={(v) => onPriorityChange(Number(v))}
              placeholder="Priority"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDisabled || !title.trim()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onSave}
          >
            Save
          </button>
          <button
            type="button"
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
);

CreateCardInput.displayName = 'CreateCardInput';

export default memo(CreateCardInput);
