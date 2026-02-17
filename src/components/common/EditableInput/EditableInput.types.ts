export interface EditableInputProps {
  value: string;
  onSave: (newValue: string) => void | Promise<void>;
  placeholder?: string;
  validate?: (value: string) => string | null;
  saveOnBlur?: boolean;
  rows?: number;
}
