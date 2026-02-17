import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonSize = 'x-small' | 'small' | 'medium' | 'large'; // X-Small, Small, Medium, Large
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'link'
  | 'plain'
  | 'danger'
  | 'info'
  | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize; // Small, Medium, Large, or Special Design
  children?: ReactNode;
  variant?: ButtonVariant;
}
