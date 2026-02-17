import type { ReactNode } from 'react';

export interface InlineEditProps<T extends string | number> {
  value: T;
  onSave?: (newValue: T) => void | Promise<void>;
  onCancel?: () => void;

  renderDisplay: (value: T, startEditing: () => void) => ReactNode;
  renderEditor: (
    value: T,
    setValue: (v: T) => void,
    save: () => void,
    cancel: () => void,
    isSaving: boolean
  ) => ReactNode;

  validate?: (value: T) => string | null; // returns error message if invalid
  saveOnBlur?: boolean; // auto-save when clicking outside
}
