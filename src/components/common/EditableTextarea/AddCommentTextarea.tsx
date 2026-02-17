import { useState, useRef } from 'react';
import TextArea from '../Textarea/TextArea';
import Button from '../Button/Button';

interface AddCommentTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onSave: (comment: string) => void | Promise<void>;
  placeholder?: string;
  rows?: number;
}

export default function AddCommentTextarea({
  value,
  onChange,
  onSave,
  placeholder = 'Add a comment...',
  rows = 4,
}: AddCommentTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = async () => {
    if (!value.trim()) return;
    setIsSaving(true);
    await onSave(value);
    setIsSaving(false);
    setIsFocused(false);
  };

  const handleCancel = () => {
    onChange('');
    setIsFocused(false);
    textareaRef.current?.blur();
  };

  return (
    <div className="flex flex-col gap-2">
      <TextArea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        rows={rows}
        placeholder={placeholder}
        className="border rounded p-2 w-full resize-none bg-transparent text-sm text-gray-100"
        aria-label={placeholder}
      />
      {isFocused && (
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving || !value.trim()}
            type="button"
            variant="primary"
            aria-label="Save comment"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={handleCancel} type="button" variant="ghost" aria-label="Cancel comment">
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
