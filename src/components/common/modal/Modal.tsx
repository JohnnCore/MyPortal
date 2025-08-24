// import type { ModalProps } from "./Modal.types";
// import cn from "classnames";

// export const Modal = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size,
// }: ModalProps) => {
//   return (
//     <div>
//       {isOpen && (
//         <>
//           {/* Modal container */}
//           <div className="fixed inset-0 flex items-center justify-center z-modal">
//             <div
//               className={cn(
//                 "bg-white pb-4 pt-8 px-4 sm:py-6 sm:px-10 md:rounded-lg md:mx-8 relative flex flex-col w-[100vw] h-[100%] md:max-h-[90%] md:h-auto transition-all",
//                 {
//                   "md:max-w-[600px]": size === "small",
//                   "md:max-w-[800px]": size === "large",
//                   "md:max-w-[1000px]": size === "extra_large",
//                 }
//               )}
//             >
//               <div className="modal-header">
//                 <h2>{title}</h2>
//                 <button
//                   className="absolute right-0 top-0 m-4 text-gray-700 hover:text-gray-900"
//                   onClick={onClose}
//                 >
//                   X
//                 </button>
//               </div>
//               <div className="modal-content">{children}</div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Modal;

import { ReactNode, MouseEvent } from "react";
import cn from "classnames";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "small" | "large" | "extra_large";
  customZIndex?: number;
  hideYOverflow?: boolean;
  closeableOnOverlay?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "small",
  customZIndex,
  hideYOverflow,
  closeableOnOverlay = true,
}: ModalProps) => {
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
        className="fixed inset-0 bg-black/60  z-40"
        style={{ zIndex: customZIndex ? customZIndex - 1 : 40 }}
        onClick={handleOverlayClick}
      />

      {/* Modal container */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ zIndex: customZIndex || 50 }}
      >
        <div
          className={cn(
            "background-modal pb-4 pt-8 px-4 sm:py-6 sm:px-10 md:rounded-lg md:mx-8 relative flex flex-col w-[100vw] h-[100%] md:max-h-[90%] md:h-auto transition-all",
            {
              "md:max-w-[600px]": size === "small",
              "md:max-w-[800px]": size === "large",
              "md:max-w-[1000px]": size === "extra_large",
              "overflow-y-auto": !hideYOverflow,
              "overflow-y-hidden": hideYOverflow,
            }
          )}
        >
          <div className="modal-header flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={onClose}
              // type="button"
            >
              ×
            </button>
          </div>
          <div className="modal-content flex-1">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
