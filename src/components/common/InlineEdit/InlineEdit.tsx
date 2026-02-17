import { useCallback, useEffect, useRef, useState } from 'react';
import type { InlineEditProps } from './InlineEdit.types';

export default function InlineEdit<T extends string | number>({
  value,
  onSave,
  onCancel,
  renderDisplay,
  renderEditor,
  validate,
  saveOnBlur = false,
}: InlineEditProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const startEditing = () => {
    setDraft(value);
    setError(null);
    setIsEditing(true);
  };

  const cancel = useCallback(() => {
    setDraft(value);
    setIsEditing(false);
    setError(null);
    onCancel?.();
  }, [value, onCancel]);

  const save = useCallback(async () => {
    const validationError = validate?.(draft) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.(draft);
      setIsEditing(false);
      setError(null);
    } finally {
      setIsSaving(false);
    }
  }, [draft, validate, onSave]);

  // handle keyboard: Enter = save, Escape = cancel
  const saveRef = useRef(save);
  saveRef.current = save;
  const cancelRef = useRef(cancel);
  cancelRef.current = cancel;

  useEffect(() => {
    if (!isEditing) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cancelRef.current();
      if (e.key === 'Enter') saveRef.current();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isEditing]);

  // handle click outside
  useEffect(() => {
    if (!isEditing || !saveOnBlur) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        saveRef.current();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, saveOnBlur]);

  return (
    <div ref={wrapperRef}>
      {isEditing ? (
        <div>
          {renderEditor(draft, setDraft, save, cancel, isSaving)}
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      ) : (
        renderDisplay(value, startEditing)
      )}
    </div>
  );
}
