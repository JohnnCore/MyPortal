// EditableField.tsx
import {
  useState,
  ReactNode,
  cloneElement,
  isValidElement,
  KeyboardEvent,
} from "react";

interface EditableFieldProps {
  value: string | ReactNode;
  children: ReactNode;
  isDisabled?: boolean;
  isEdit?: boolean;
}

export const EditableField = ({
  value,
  children,
  isDisabled,
  isEdit,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isDisabled) return <span>{value || "—"}</span>;

  const handleBlur = () => {
    if (isEdit) setIsEditing(false);
    return;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  const editableChildren = isValidElement(children)
    ? cloneElement(children as any, {
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        autoFocus: true,
        // Ensure the input value reflects the current `value` prop
        value,
      })
    : children;

  return (
    <div
      onClick={() => !isEditing && setIsEditing(true)}
      className="cursor-pointer"
    >
      {!isEdit ? (
        children
      ) : isEditing && isEdit ? (
        editableChildren
      ) : (
        <span>{value || "—"}</span>
      )}
    </div>
  );
};
