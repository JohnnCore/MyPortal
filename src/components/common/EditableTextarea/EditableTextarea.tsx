import InlineEdit from '../InlineEdit/InlineEdit';
import TextArea from '../Textarea/TextArea';
import Button from '../Button/Button';
import type { EditableTextareaProps } from './EditableTextarea.types';

export default function EditableTextarea({
  value,
  onSave,
  placeholder,
  validate,
  saveOnBlur = false,
  rows = 4,
}: EditableTextareaProps) {
  return (
    <InlineEdit
      value={value}
      onSave={onSave}
      saveOnBlur={saveOnBlur}
      validate={validate}
      renderDisplay={(val, start) => (
        <div
          onClick={start}
          className="cursor-text whitespace-pre-wrap hover:bg-dropdown-hover-background rounded"
          tabIndex={0}
          role="textbox"
          aria-label={placeholder || 'Edit text'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') start();
          }}
        >
          {val || placeholder || 'Click to edit'}
        </div>
      )}
      renderEditor={(draft, setDraft, save, cancel, isSaving) => (
        <div className="flex flex-col gap-2">
          <TextArea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            rows={rows}
            placeholder={placeholder}
            className="border rounded p-2 w-full resize-none"
            aria-label={placeholder || 'Edit text'}
          />
          <div className="flex gap-2 justify-end">
            <Button
              onClick={save}
              disabled={isSaving || draft === value}
              type="button"
              variant="primary"
              aria-label="Save"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={cancel} type="button" variant="ghost" aria-label="Cancel">
              Cancel
            </Button>
          </div>
        </div>
      )}
    />
  );
}
