import { HTMLAttributes, ReactNode } from "react";

export type ButtonSize = "small" | "large" | "x-small"; // Small, Medium, Large, or Special Design
export type ButtonVariant = "primary" | "secondary" | "link" | "plain";

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    size?: ButtonSize  // Small, Medium, Large, or Special Design
    children?: ReactNode;
    variant?: ButtonVariant;
}