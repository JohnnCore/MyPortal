import { ReactNode, MouseEvent, useEffect } from 'react';
import cn from '../../../utils/cn';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'large' | 'extra_large' | 'auto' | 'medium';
  customZIndex?: number;
  hideYOverflow?: boolean;
  closeableOnOverlay?: boolean;
  headerContent?: ReactNode;
  tooltip?: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'auto',
  customZIndex,
  hideYOverflow,
  closeableOnOverlay = true,
  headerContent,
  tooltip,
}: ModalProps) => {
  // Accessibility: ESC key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Tab trap
      if (e.key === 'Tab') {
        const modal = document.getElementById('modal-root');
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (focusable.length === 0) return;
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Removed auto-focus logic on modal open
  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent) => {
    if (closeableOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop/Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        style={{ zIndex: customZIndex ? customZIndex - 1 : 40 }}
      />

      {/* Modal container with overlay click handler */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 px-20"
        style={{ zIndex: customZIndex || 50 }}
        onClick={handleOverlayClick}
      >
        <div
          id="modal-root"
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : undefined}
          tabIndex={-1}
          className={cn(
            'bg-modal-background pb-4 pt-8 sm:py-6 sm:px-10 md:rounded-lg md:mx-8 relative flex flex-col w-screen h-full md:max-h-[90%] md:h-[85%] transition-all',
            {
              'md:max-w-150': size === 'small',
              'md:max-w-200': size === 'medium',
              'md:max-w-250': size === 'large',
              'md:max-w-7xl': size === 'extra_large',
              'md:max-w-none': size === 'auto',
              'overflow-y-auto': !hideYOverflow,
              'overflow-y-hidden': hideYOverflow,
            }
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {headerContent && <span>{headerContent}</span>}
            </div>
            <div className="flex items-center gap-2">
              {tooltip}
              <button
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                onClick={onClose}
                // type="button"
              >
                <X />
              </button>
            </div>
          </div>
          <div className="modal-content flex-1">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
