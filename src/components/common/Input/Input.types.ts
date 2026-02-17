// import { ChangeEvent, FocusEvent, KeyboardEvent, CSSProperties, InputHTMLAttributes } from "react";
import React from 'react';

export type InputType =
  | 'text' // Standard text input
  | 'password' // Password input
  | 'email' // Email input
  | 'number'; // Numeric input

export interface BaseInputProps {
  type?: InputType; // e.g., "text", "password", "email"
  label?: string; // Label for the input field
  error?: boolean;
  touched?: boolean;
  labelClasses?: string;
  valueErrorMessage?: string; // Custom error message for value validation
}

export type InputProps = BaseInputProps & React.InputHTMLAttributes<HTMLInputElement>;

export type TextareaProps = BaseInputProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
