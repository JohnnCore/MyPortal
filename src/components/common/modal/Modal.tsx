import type { ModalProps } from "./Modal.types";
import cn from "classnames";

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
        <div
          className={cn(
            "bg-white pb-4 pt-8 px-4 sm:py-6 sm:px-10 md:rounded-lg md:mx-8 z-modalDialog relative flex flex-col w-[100vw] h-[100%] md:max-h-[90%] md:h-auto transition-all",
            {
              "md:max-w-[600px]": size === "small",
              "md:max-w-[800px]": size === "large",
              "md:max-w-[1000px]": size === "extra_large",
            }
          )}
        >
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
