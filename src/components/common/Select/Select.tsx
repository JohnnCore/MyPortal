import React, {
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from '../../../utils/cn';
import DownArrow from '../../../assets/ic_down_arrow.svg';
import type { DropdownValues } from '../../../types/ui/select';

export interface SelectProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  label: string;
  options: DropdownValues[];
  value?: string | number | null;
  onChange?: (value: string | number | null | undefined | object) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  labelClasses?: string;
  error?: boolean;
  isLoading?: boolean;
}

const Select = ({
  label,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  value,
  onChange,
  onBlur,
  required,
  className,
  labelClasses,
  error,
  isLoading = false,
  ...rest
}: SelectProps) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const listboxId = useId();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => options.find((o) => String(o.id) === String(value)) ?? null,
    [value, options]
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter((opt) => opt.name.toLowerCase().includes(searchLower));
  }, [options, search]);

  useEffect(() => {
    if (isOpen) {
      const selectedIndex = filteredOptions.findIndex((opt) => String(opt.id) === String(value));
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, filteredOptions, value]);

  const handleSelect = (option: DropdownValues) => {
    onChange?.(option.id);
    setIsOpen(false);
    setSearch('');
    inputRef.current?.blur();
    onBlur?.();
  };

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
        inputRef.current?.blur();
        onBlur?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onBlur]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) handleSelect(option);
    }

    if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false);
      setSearch('');
      onBlur?.();
    }
  };

  return (
    <div className="relative w-full">
      <label className={cn('block text-sm font-medium text-input-label mb-1', labelClasses)}>
        <span>{label}</span>
        {required && <span className="text-danger"> *</span>}
      </label>

      <div ref={wrapperRef} className="relative">
        <input
          ref={inputRef}
          type="text"
          className={cn(
            'w-full px-3 py-2 border-2 rounded-md shadow-sm focus:border-input-border-focus focus:ring-input-border-focus focus:outline-none',
            disabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-input-border'
              : 'bg-card-background text-input-text cursor-text border-input-border',
            error && ' border-danger',
            className
          )}
          value={isOpen ? search : (selected?.name ?? '')}
          onClick={() => {
            if (!disabled && !isOpen) setIsOpen(true); // open but not close
          }}
          onFocus={() => {
            if (!disabled && !isOpen) setIsOpen(true);
          }}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && filteredOptions[highlightedIndex]
              ? `option-${filteredOptions[highlightedIndex].id}`
              : undefined
          }
          aria-expanded={isOpen}
          aria-required={required}
          {...rest}
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()} // prevents input blur
          onClick={() => {
            if (disabled) return;
            setIsOpen((prev) => !prev);
            setSearch('');
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:cursor-pointer"
        >
          <img
            src={DownArrow}
            alt="Toggle dropdown"
            className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && !disabled && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute z-10 w-full mt-1 border rounded-md shadow-lg bg-modal-background max-h-60 overflow-auto"
            onMouseDown={(e) => e.preventDefault()} // prevent blur
          >
            {isLoading ? (
              <div className="px-3 py-2 text-gray-400">Loading...</div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const isHighlighted = highlightedIndex === index;
                const isSelected = selected?.id === opt.id;
                return (
                  <div
                    id={`option-${opt.id}`}
                    key={opt.id}
                    role="option"
                    aria-selected={isSelected}
                    className={cn('px-3 py-2 cursor-pointer text-white', {
                      'bg-dropdown-hover-background': isHighlighted,
                      'bg-dropdown-selected': isSelected,
                    })}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt.name}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-gray-400">No results found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Select);
