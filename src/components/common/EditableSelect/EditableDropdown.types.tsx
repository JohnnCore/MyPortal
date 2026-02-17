import { MetaResponse } from '../../../types';

export interface EditableDropdownProps {
  value: string | number | null;
  options: MetaResponse[];
  onSave: (newValue: string | number) => void | Promise<void>;
  placeholder?: string;
  validate?: (value: string | number | null) => string | null;
  saveOnBlur?: boolean;
  label?: string;
}
