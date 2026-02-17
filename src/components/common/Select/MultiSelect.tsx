import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  KeyboardEvent,
  InputHTMLAttributes,
} from 'react';
import type { MetaResponse } from '../../../types';
import useDebounce from '../../../hooks/useDebounce';
import { generateNegativeTimestampID } from '../../../utils/helpers';

export interface MultiSelectProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> {
  label: string;
  options?: MetaResponse[];
  placeholder?: string;
  disabled?: boolean;
  value?: MetaResponse[];
  onChange?: (value: MetaResponse[]) => void;
  creatable?: boolean;
}

const getOptionId = (index: number) => `option-${index}`;

const MultiSelect = ({
  label,
  options = [],
  placeholder = 'Select or type...',
  disabled = false,
  value = [],
  onChange,
  required,
  creatable = false,
  ...rest
}: MultiSelectProps) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [internalOptions, setInternalOptions] = useState<MetaResponse[]>(options);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(search, 200);

  // Keep internal options in sync with props
  useEffect(() => {
    setInternalOptions(options);
  }, [options]);

  const filteredOptions = useMemo(() => {
    // If dropdown is open but no search yet → show all available options
    const query = debouncedSearch.trim().toLowerCase();
    const available = internalOptions.filter((opt) => !value.some((v) => v.id === opt.id));

    if (!query) return available; // show all when no search term
    return available.filter((opt) => opt.name.toLowerCase().includes(query));
  }, [internalOptions, debouncedSearch, value]);

  /** Add selected option */
  const handleAdd = useCallback(
    (option: MetaResponse) => {
      if (!value.some((v) => v.id === option.id)) {
        onChange?.([...value, option]);
      }
      setSearch('');
      setIsOpen(false);
      inputRef.current?.focus();
    },
    [value, onChange]
  );

  /** Remove tag */
  const handleRemove = useCallback(
    (id: string | number) => {
      onChange?.(value.filter((v) => v.id !== id));
    },
    [value, onChange]
  );

  /** Create new option */
  const handleCreate = useCallback(
    (name: string) => {
      const newOption: MetaResponse = {
        id: generateNegativeTimestampID(),
        name,
      };
      setInternalOptions((prev) => [...prev, newOption]);
      handleAdd(newOption);
    },
    [handleAdd]
  );

  /** Close when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** Reset highlight when list changes */
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions.length]);

  /** Keyboard controls */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % filteredOptions.length);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setHighlightedIndex((i) => (i === 0 ? filteredOptions.length - 1 : i - 1));
        break;
      }
      case 'Enter': {
        e.preventDefault();
        const option = filteredOptions[highlightedIndex];
        if (option) {
          handleAdd(option);
        } else if (creatable && debouncedSearch.trim()) {
          handleCreate(debouncedSearch.trim());
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        break;
      }
      default:
        break;
    }
  };

  /** Can create new tag? */
  const canCreate =
    creatable &&
    debouncedSearch.trim() &&
    !internalOptions.some(
      (opt) => opt.name.toLowerCase() === debouncedSearch.trim().toLowerCase()
    ) &&
    !value.some((v) => v.name.toLowerCase() === debouncedSearch.trim().toLowerCase());

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {label && (
        <label id="select-label" className="block text-sm font-medium text-input-label mb-1">
          {required ? `${label} *` : label}
        </label>
      )}

      {/* Input area with tags */}
      <div
        className={`flex flex-wrap items-center gap-2 w-full px-2 py-2 border rounded-md shadow-sm min-h-10.5 transition-all ${
          disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-card-background text-white cursor-text border-input-border'
        }`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {value.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center px-2 py-1 rounded bg-gray-700 text-white text-sm"
          >
            {tag.name}
            <button
              type="button"
              className="ml-2 text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(tag.id);
              }}
            >
              ✕
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none text-white px-1 py-1"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          // required={required}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls="select-listbox"
          {...rest}
        />
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div
          id="select-listbox"
          aria-labelledby="select-label"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="select-listbox"
          aria-activedescendant={
            isOpen && filteredOptions[highlightedIndex] ? getOptionId(highlightedIndex) : undefined
          }
          aria-autocomplete="list"
          className="absolute z-10 w-full mt-1 border rounded-md shadow-lg bg-modal-background max-h-60 overflow-auto"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => (
              <div
                id={getOptionId(index)}
                key={opt.id}
                role="option"
                aria-selected={value.some((v) => v.id === opt.id)}
                className={`px-3 py-2 cursor-pointer text-white ${
                  index === highlightedIndex ? 'bg-dropdown-hover-background' : ''
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleAdd(opt)}
              >
                {opt.name}
              </div>
            ))
          ) : canCreate ? (
            <div
              className="px-3 py-2 cursor-pointer text-blue-400 hover:bg-dropdown-hover-background"
              onClick={() => handleCreate(debouncedSearch.trim())}
            >
              Create “{debouncedSearch.trim()}”
            </div>
          ) : (
            <div className="px-3 py-2 text-gray-400">No results</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
