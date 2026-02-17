/**
 * Form UI Types
 */

import { MouseEvent } from 'react';

export type InputType = 'text' | 'password' | 'email' | 'number';

export interface BaseInputProps {
  type?: InputType;
  label?: string;
  error?: boolean;
  touched?: boolean;
  labelClasses?: string;
  valueErrorMessage?: string;
}

export type ButtonSize = 'x-small' | 'small' | 'medium' | 'large';
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'link'
  | 'plain'
  | 'danger'
  | 'info'
  | 'ghost';

// Generic form state types
export type FormValues = Record<string, unknown>;

export type FormErrors<T extends FormValues> = {
  [K in keyof T]?: string;
};

export type FormTouched<T extends FormValues> = {
  [K in keyof T]?: boolean;
};

export interface FormMeta {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  submitCount: number;
}

export interface FormState<T extends FormValues> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  meta: FormMeta;
}

// Form reference type for imperative handles
export interface FormRef {
  triggerCancel: (e?: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}
