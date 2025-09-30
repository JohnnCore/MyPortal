// import { ChangeEvent, FocusEvent, KeyboardEvent, CSSProperties, InputHTMLAttributes } from "react";
import { InputHTMLAttributes } from "react";

export type InputType =
  | "text" // Standard text input
  | "password" // Password input
  | "email" // Email input
  | "number" // Numeric input
  | "textarea"; // Multi-line text input

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  type?: InputType; // e.g., "text", "password", "email"
  label?: string; // Label for the input field
  error?: string | undefined;
  touched?: boolean;
  labelClasses?: string;

  // placeholder?: string; // Placeholder text for the input
  // value?: string; // Current value of the input
  // onChange?: (event: ChangeEvent<HTMLInputElement>) => void; // Change event handler
  // onBlur?: (event: FocusEvent<HTMLInputElement>) => void; // Blur event
  // onFocus?: (event: FocusEvent<HTMLInputElement>) => void; // Focus event handler
  // name?: string; // Name attribute for the input
  // id?: string; // ID attribute for the input
  // className?: string; // Additional CSS classes for styling
  // disabled?: boolean; // Whether the input is disabled
  // required?: boolean; // Whether the input is required
  // autoComplete?: string; // Auto-complete attribute for the input
  // autoFocus?: boolean; // Whether the input should be focused automatically
  // maxLength?: number; // Maximum length of the input value
  // minLength?: number; // Minimum length of the input value
  // pattern?: string; // Regular expression pattern for validation
  // readOnly?: boolean; // Whether the input is read-only
  // size?: number; // Size of the input (number of characters)
  // step?: number; // Step value for numeric inputs
  // // inputMode?: string; // Input mode for the virtual keyboard (e.g., "numeric", "text")
  // ariaLabel?: string; // ARIA label for accessibility
  // ariaDescribedBy?: string; // ID of an element that describes the input for accessibility
  // ariaInvalid?: boolean; // Whether the input is invalid for accessibility
  // ariaRequired?: boolean; // Whether the input is required for accessibility
  // onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void; // Key down event handler
  // onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void; // Key up event handler
  // onKeyPress?: (event: KeyboardEvent<HTMLInputElement>) => void; // Key press event handler
  // style?: CSSProperties; // Inline styles for the input
  // patternErrorMessage?: string; // Custom error message for pattern validation
  // maxLengthErrorMessage?: string; // Custom error message for max length validation
  // minLengthErrorMessage?: string; // Custom error message for min length validation
  valueErrorMessage?: string; // Custom error message for value validation
  /**
   * Optional boolean that determines whether the input should be focused when the component mounts.
   * - `true`: The input will be focused automatically.
   *
   * - `false`: The input will not be focused automatically.
   */
}
