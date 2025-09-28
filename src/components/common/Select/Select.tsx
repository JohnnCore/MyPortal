import { useState, InputHTMLAttributes } from "react";

export interface SelectOption {
  id: number | string;
  value: string;
  label: string;
}

export type SelectFieldValue = SelectOption | null;

interface SelectProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  disabled: boolean;
}

const Select = ({
  label,
  options,
  placeholder = "Search...",
  disabled = false,
  ...rest
}: SelectProps) => {
  options = [{ id: 1, value: "option1", label: "Option 1" }];
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectFieldValue>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option: SelectOption) => {
    setSelected(option);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* "Fake select" */}
      <div
        className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-pointer ${
          disabled
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-modal-background-color text-white"
        }`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        {selected ? (
          selected.label
        ) : (
          <span className="text-gray-400">Select...</span>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 border rounded-md shadow-lg bg-modal-background-color max-h-60 overflow-auto">
          {/* Search bar */}
          <input
            type="text"
            placeholder={placeholder}
            className="w-full px-3 py-2 border-b outline-none text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            {...rest}
          />

          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-3 py-2 hover:bg-dropdown-hover-background-color cursor-pointer text-white"
                onClick={() => handleSelect(option)}
              >
                {option.label}
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
