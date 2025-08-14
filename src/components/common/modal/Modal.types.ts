import { PropsWithChildren } from "react";

export interface ModalProps extends PropsWithChildren<{}> {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  size?: ModalDesktopSizeType;
  hideYOverflow?: boolean;
  customZIndex?: number;
  /** If true, the modal will close when the user clicks on the overlay surrounding the modal. */
  closeableOnOverlay?: boolean;
}

export interface ConfirmationModalContentProps extends PropsWithChildren<{}> {
  onClose: () => void;
  onSubmit: () => void;
}

// 1️⃣ Define the runtime constant object first
export const ModalDesktopSize = {
  SMALL: "small",
  LARGE: "large",
  EXTRA_LARGE: "extra_large",
} as const;

// 2️⃣ Derive the type from the object
export type ModalDesktopSizeType =
  (typeof ModalDesktopSize)[keyof typeof ModalDesktopSize];
