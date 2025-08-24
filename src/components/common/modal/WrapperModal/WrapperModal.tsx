import { useAppDispatch, useAppSelector } from "../../../../hooks/reduxHooks";
import { closeModal } from "../../../../redux/modal/modalSlice";
import Button from "../../Button/Button";
import Modal from "../Modal";

/**
 * WrapperModal is a component responsible for rendering a modal dialog
 * with dynamic content and actions based on the Redux state.
 *
 * It retrieves modal data (title, content, and buttons) from the Redux store
 * and handles user interactions, such as confirming or closing the modal.
 *
 * When the modal is closed or confirmed, the modal is dismissed by
 * dispatching the `closeModal` action.
 */
const WrapperModal = () => {
  const dispatch = useAppDispatch();
  const {
    title: modalTittle,
    isModalOpen,
    content,
    customZIndex,
    closeableOnOverlay,
    hideYOverflow,
    size = "small",
    isLoading,
  } = useAppSelector((state) => state.modalSlice);

  const { title, children, buttons } = content;

  const { primary: primaryButton, secondary: secondaryButton } = buttons;
  const { text: primaryText, handler: onPrimaryHandler } = primaryButton;
  const { text: secondaryText, handler: onSecondaryHandler } = secondaryButton;

  const handleConfirmModal = async () => {
    if (onPrimaryHandler) await onPrimaryHandler();
    dispatch(closeModal());
  };

  const handleCloseModal = () => {
    if (onSecondaryHandler) onSecondaryHandler();
    dispatch(closeModal());
  };

  return isModalOpen ? (
    <Modal
      title={modalTittle}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      size={size}
      customZIndex={customZIndex}
      hideYOverflow={hideYOverflow}
      closeableOnOverlay={closeableOnOverlay}
    >
      <div className="flex flex-col flex-1 gap-6 justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-neutral-grey-800">
            {title}
          </h3>
          <div>{children}</div>
        </div>
        <Button onClick={handleConfirmModal} size="small">
          {primaryText}
        </Button>
        <Button onClick={handleCloseModal} size="small" variant="secondary">
          {secondaryText}
        </Button>
      </div>
    </Modal>
  ) : null;
};

export default WrapperModal;
