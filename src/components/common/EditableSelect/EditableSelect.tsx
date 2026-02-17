import InlineEdit from '../InlineEdit/InlineEdit';
import Select from '../Select/Select';
import Button from '../Button/Button';
import { EditableDropdownProps } from './EditableDropdown.types';

export default function EditableSelect({
  value,
  options,
  onSave,
  placeholder = 'Select...',
  validate,
  saveOnBlur = false,
  label = '',
}: EditableDropdownProps) {
  const id = 'editable-dropdown';

  return (
    <InlineEdit
      value={value ?? ''}
      onSave={onSave}
      validate={validate}
      saveOnBlur={saveOnBlur}
      renderDisplay={(val, start) => {
        const selected = options.find((o) => String(o.id) === String(val));

        return (
          <label
            htmlFor={id}
            className="cursor-pointer text-gray-800 dark:text-white"
            onFocus={start}
            onClick={start}
          >
            {selected?.name || placeholder}
          </label>
        );
      }}
      renderEditor={(draft, setDraft, save, cancel, isSaving) => (
        <div className="flex flex-col gap-2 w-full">
          <Select
            id={id}
            label={label}
            options={options}
            value={draft}
            placeholder={placeholder}
            onChange={(val) => {
              // Only set draft for valid string/number values
              if (typeof val === 'string' || typeof val === 'number') {
                setDraft(val);
              }
            }}
            onBlur={() => {
              if (saveOnBlur) save();
            }}
          />

          {!saveOnBlur && (
            <div className="flex gap-2">
              <Button
                onClick={save}
                disabled={isSaving}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={cancel} className="bg-gray-300 px-3 py-1 rounded">
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    />
  );
}
