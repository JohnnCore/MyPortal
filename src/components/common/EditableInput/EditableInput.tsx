import InlineEdit from '../InlineEdit/InlineEdit';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { Check, X } from 'lucide-react';
import { EditableInputProps } from './EditableInput.types';

export default function EditableInput({
  value,
  onSave,
  placeholder,
  validate,
  saveOnBlur = false,
}: EditableInputProps) {
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
          aria-label={placeholder || 'Edit input'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') start();
          }}
        >
          {val || placeholder || 'Click to edit'}
        </div>
      )}
      renderEditor={(draft, setDraft, save, cancel, isSaving) => (
        <div className="flex flex-col gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
            placeholder={placeholder}
            className="border rounded p-2 w-full resize-none"
            aria-label={placeholder || 'Edit input'}
          />
          <div className="flex gap-2 justify-end">
            <Button
              onClick={save}
              disabled={isSaving || draft === value}
              type="button"
              variant="primary"
              aria-label="Save"
            >
              <Check size={16} />
            </Button>
            <Button onClick={cancel} type="button" variant="ghost" aria-label="Cancel">
              <X size={16} />
            </Button>
          </div>
        </div>
      )}
    />
  );
}
