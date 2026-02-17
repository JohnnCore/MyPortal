// Textarea.tsx
import React, { forwardRef } from 'react';
import cn from '../../../utils/cn';
import { TextareaProps } from '../Input/Input.types';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, labelClasses, className, id, required, error, ...rest }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className={cn('block mb-2 text-sm font-medium text-input-label', labelClasses)}
        >
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'border border-gray-300 rounded-md p-2 resize-y w-full',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          aria-required={required}
          {...rest}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default React.memo(Textarea);
