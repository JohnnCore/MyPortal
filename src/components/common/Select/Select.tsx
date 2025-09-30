import {
  useState,
  InputHTMLAttributes,
  useRef,
  useEffect,
  KeyboardEvent,
} from "react";
import { MetaResponse } from "../../../types/board";

export interface SelectProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label: string;
  options: MetaResponse[] | undefined;
  placeholder?: string;
  disabled?: boolean;
  value?: string | number | null;
  onChange?: (value: string | number) => void;
}

const Select = ({
  label,
  options = [],
  placeholder = "Select...",
  disabled = false,
  value,
  onChange,
  ...rest
}: SelectProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<MetaResponse | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync internal selected with external value
  // useEffect(() => {
  //   if (value != null && options?.length) {
  //     const current =
  //       options.find((o) => String(o.id) === String(value)) ?? null;
  //     setSelected(current);
  //   } else {
  //     setSelected(null);
  //   }
  // }, [value, options]);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: MetaResponse) => {
    setSelected(option);
    onChange?.(option.id);
    setIsOpen(false);
    setSearch("");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) handleSelect(option);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setSearch("");
    }
  };

  // useEffect(() => {
  //   // Reset highlighted index when filtering changes
  //   setHighlightedIndex(0);
  // }, [search, isOpen]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        className={`w-full px-3 py-2 border border-input-border rounded-md shadow-sm ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-card-background text-white cursor-text"
        }`}
        value={isOpen ? search : selected?.name ?? ""}
        onFocus={() => !disabled && setIsOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onClick={() => !disabled && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="select-listbox"
        aria-autocomplete="list"
        {...rest}
      />

      {isOpen && !disabled && (
        <div
          id="select-listbox"
          role="listbox"
          className="absolute z-10 w-full mt-1 border rounded-md shadow-lg bg-modal-background-color max-h-60 overflow-auto"
        >
          {filteredOptions.length ? (
            filteredOptions.map((opt, index) => (
              <div
                key={opt.id}
                role="option"
                aria-selected={selected?.id === opt.id}
                className={`px-3 py-2 cursor-pointer text-white ${
                  index === highlightedIndex
                    ? "bg-dropdown-hover-background-color"
                    : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(opt)}
              >
                {opt.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400">No results</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
