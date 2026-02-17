import Button from '../../Button/Button';
import Modal from '../Modal';
import type { ConfirmDialogProps } from './ConfirmationModal.types';

const ConfirmDialog = ({
  isOpen,
  isLoading = false,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Handle error or re-throw to parent
      console.error('Confirmation action failed:', error);
      throw error;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="small">
      <div className="flex flex-col gap-6">
        <p className="text-gray-600 whitespace-pre-line">{message}</p>

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="secondary" size="small" disabled={isLoading}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} variant={variant} size="small" disabled={isLoading}>
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
