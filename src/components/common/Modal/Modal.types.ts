export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  size?: ModalDesktopSizeType;
  hideYOverflow?: boolean;
  customZIndex?: number;
  /** If true, the modal will close when the user clicks on the overlay surrounding the modal. */
  closeableOnOverlay?: boolean;
}

export interface ConfirmationModalContentProps {
  onClose: () => void;
  onSubmit: () => void;
}

export type ModalDesktopSizeType = 'small' | 'large' | 'extra_large';
