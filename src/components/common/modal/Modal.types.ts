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


// 2️⃣ Derive the type from the object
export type ModalDesktopSizeType =
  | "small"
  | "large"
  | "extra_large";
