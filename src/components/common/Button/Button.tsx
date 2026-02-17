import cn from '../../../utils/cn';

import { ButtonProps } from './Button.types';

const Button = (props: ButtonProps) => {
  const { children, size = 'large', variant = 'primary' } = props;

  return (
    <button
      className={cn(
        `flex justify-center items-center w-full md:w-fit rounded px-4 py-2 border font-semibold`,
        {
          // Primary
          'bg-green-700 border-primary-dark-green text-primary-white hover:bg-secondary-dark-green disabled:bg-green-400':
            variant === 'primary',
          // Secondary
          'bg-white border-neutral-grey-400 text-neutral-grey-800 hover:bg-neutral-grey-100 disabled:bg-neutral-400 disabled:text-primary-white':
            variant === 'secondary',
          // Danger
          'bg-red-600 border-red-700 text-white hover:bg-red-700 disabled:bg-red-300':
            variant === 'danger',
          // Info
          'bg-blue-500 border-blue-600 text-white hover:bg-blue-600 disabled:bg-blue-300':
            variant === 'info',
          // Ghost (transparent)
          'bg-transparent border-none text-neutral-grey-300 hover:text-primary-white focus:text-primary-white focus:underline focus:outline-none shadow-none disabled:text-neutral-grey-400':
            variant === 'ghost',
          // Link
          'aims-btn-link': variant === 'link',
          // Plain
          'aims-btn-plain': variant === 'plain',
          // Sizes
          'px-6 py-3': size === 'large',
          'py-2': size === 'small',
          'py-0.5 text-xs': size === 'x-small',
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
