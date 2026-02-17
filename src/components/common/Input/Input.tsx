// Input.tsx
import React, { forwardRef } from 'react';
import { InputProps } from './Input.types';
import cn from '../../../utils/cn';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', labelClasses, className, id, required, error, ...rest }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className={cn('block mb-2 text-sm font-medium text-input-label', labelClasses)}
        >
          <span>{label}</span>
          {required && <span className="text-danger"> *</span>}
        </label>
        <input
          ref={ref}
          id={id}
          className={cn(
            'border-2 border-input-border rounded-md p-2 text-input-text w-full focus:border-input-border-focus focus:ring-input-border-focus focus:outline-none',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          type={type}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default React.memo(Input);
