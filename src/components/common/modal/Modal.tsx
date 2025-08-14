import type { ModalProps } from "./Modal.types";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size,
}: ModalProps) => {
  return (
    <div>
      {isOpen && (
        <div className={`${size}`}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button onClick={onClose}>Close</button>
          </div>
          <div className="modal-content">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Modal;
