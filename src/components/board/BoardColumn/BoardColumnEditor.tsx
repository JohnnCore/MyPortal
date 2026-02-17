import InlineEdit from '../../common/InlineEdit/InlineEdit';
import ColumnMenu from './ColumnMenu';
import { Props } from './BoardColumnEditor.types';

export default function BoardColumnEditor({
  status,
  count,
  isLoading = false,
  onSave,
  onCancel,
  onMoveLeft,
  onMoveRight,
  canMoveLeft = false,
  canMoveRight = false,
}: Props) {
  return (
    <section className="min-w-70 max-w-87.5 p-4 rounded-lg bg-gray-100 dark:bg-column-background">
      <header className="flex items-center justify-between mb-4">
        <InlineEdit
          value={status.name}
          onSave={async (newName) => {
            // Optional async save
            if (newName.trim() === status.name.trim()) return;
            await onSave?.(status.id, newName);
          }}
          onCancel={onCancel}
          saveOnBlur={true} // save when clicking outside
          validate={(val) => (val.trim() === '' ? 'Column name cannot be empty' : null)}
          renderDisplay={(value, start) => (
            <div className="flex items-center gap-2 flex-1">
              <h2
                onClick={start}
                className="text-xl font-semibold text-gray-800 dark:text-white cursor-pointer"
              >
                {value}
              </h2>
              <span className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {count}
              </span>
            </div>
          )}
          renderEditor={(draft, setDraft, save, cancel, isSaving) => (
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
                className="px-2 py-1 text-lg font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-800 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={save}
                disabled={isSaving}
                className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-800"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={cancel}
                className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-800"
              >
                X
              </button>
            </div>
          )}
        />
        <ColumnMenu
          onMoveLeft={onMoveLeft}
          onMoveRight={onMoveRight}
          canMoveLeft={canMoveLeft}
          canMoveRight={canMoveRight}
        />
      </header>

      <div className="space-y-3 min-h-12.5 relative">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 dark:border-gray-400"></div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click the title to edit this column name.
          </p>
        )}
      </div>
    </section>
  );
}
