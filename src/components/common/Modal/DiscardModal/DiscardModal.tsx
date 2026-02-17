import Button from '../../Button/Button';
import Modal from '../Modal';

interface DiscardDialogProps {
  isOpen: boolean;
  onDiscard: () => void;
  onCancel: () => void;
}

const DiscardDialog = ({ isOpen, onDiscard, onCancel }: DiscardDialogProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Discard Changes?" size="small">
      <div className="flex flex-col gap-6">
        <div className="text-gray-600">
          <p>Are you sure you want to cancel and lose your changes?</p>
          <p className="mt-2 text-sm text-gray-500">All unsaved data will be permanently lost.</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onCancel} variant="secondary" size="small">
            Keep Editing
          </Button>

          <Button onClick={onDiscard} variant="danger" size="small">
            Discard Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DiscardDialog;
