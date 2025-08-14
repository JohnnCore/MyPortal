import { ModalDesktopSize } from "../../components/common/Modal/Modal.types";
import { ModalContent, ModalSliceInitialState } from "./modalSlice.types";

export const defaultDiscardChildren = (
  <>
    <p className="pb-6 text-neutral-grey-800">You have unsaved changes.</p>
    <p className="pb-2 text-neutral-grey-800 font-bold">
      Are you sure you want to discard these changes?
    </p>
  </>
);

export const initialContent: ModalContent = {
  title: "",
  children: "",
  buttons: { primary: { text: "Confirm" }, secondary: { text: "Dismiss" } },
};

export const initialState: ModalSliceInitialState = {
  title: "",
  isModalOpen: false,
  content: initialContent,
  hideYOverflow: undefined,
  closeableOnOverlay: false,
  customZIndex: undefined,
  size: ModalDesktopSize.EXTRA_LARGE,
  isLoading: false,
};
