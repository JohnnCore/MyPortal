import { ReactNode } from "react";
import { ModalDesktopSizeType } from "../../components/common/Modal/Modal.types";

export interface Buttons {
  /**
   * The text to be displayed on the primary button.
   * This button typically represents the main action of the modal, such as "Submit" or "Save".
   */
  text: string;

  /**
   * Optional callback function to be executed when the some action is triggered within the modal.
   * This function is usually called when the user clicks the button.
   */
  handler?: () => void;
}

/**
 * The `ModalContent` interface defines the structure of the content
 * displayed within a modal dialog. This includes the title, the main
 * content, and the action buttons that the user can interact with.
 */
export interface ModalContent {
  /**
   * The title of the modal, typically displayed at the top of the modal dialog.
   * This is a brief string that represents the purpose or content of the modal.
   */
  title: string;

  /**
   * The content of the modal, usually JSX elements or React components.
   * This defines what is displayed inside the modal.
   */
  children: ReactNode;

  /**
   * An object containing the buttons displayed within the modal.
   * Each button can have associated text and an optional handler function for click events.
   */
  buttons: {
    primary: Buttons;
    secondary: Buttons;
  };

  /**
   * Indicates whether the current modal action has delegate parameters associated with it.
   *
   * - `true`: There are delegate parameters, meaning the modal is being used in a context where
   *   an action is being performed on behalf of another employee.
   * - `false` or `undefined`: No delegate parameters are present.
   *
   * When `true` and a valid `delegatedEmployee` is provided, the modal will display additional
   * UI elements indicating the action is being delegated.
   */
  hasDelegateParams?: boolean;
}

/**
 * Interface representing the initial state of a modal in the application.
 * This state is typically used in a Redux slice or a similar state management solution
 * to control the behavior and appearance of modal dialogs.
 */
export interface ModalSliceInitialState {
  /** The title of the modal, typically displayed at the top of the modal dialog. */
  title: string;

  /**
   * A boolean indicating whether the modal is currently open or closed.
   * - `true`: The modal is open and visible.
   * - `false`: The modal is closed and hidden.
   */
  isModalOpen: boolean;

  /**
   * The content to be displayed inside the modal.
   * This includes the title, the main content (children), and configuration for the modal's primary and secondary buttons.
   */
  content: ModalContent;

  /**
   * Optional boolean that controls whether the Y-axis (vertical) overflow is hidden.
   * - `true`: Overflow is hidden, preventing scrolling within the modal.
   * - `false`: Overflow is allowed, enabling scrolling within the modal content.
   */
  hideYOverflow?: boolean;

  /**
   * Optional boolean that determines whether clicking on the overlay (background) will close the modal.
   * - `true`: Clicking the overlay will close the modal.
   * - `false`: The modal will not close when the overlay is clicked.
   */
  closeableOnOverlay?: boolean;

  /**
   * Optional custom Z-index value for the modal, allowing the modal to be layered above or below other elements.
   * Defaults to a standard Z-index for modals if not provided.
   */
  customZIndex?: number;

  /**
   * Optional size of the modal for desktop view. Determines the width of the modal.
   * Possible values are defined in the `ModalDesktopSize` enum, which might include sizes such as:
   * - `SMALL`: Smaller width for compact modals.
   * - `LARGE`: Larger width for more content.
   * - `EXTRA_LARGE`: Maximum width for very large content.
   */
  size?: ModalDesktopSizeType;

  /**
   * Optional boolean that indicates whether the modal is in a loading state.
   * - `true`: The modal is in a loading state, typically showing a spinner or loading indicator.
   * - `false`: The modal is not in a loading state.
   */
  isLoading?: boolean;
}

export type DiscardModalProps = {
  /**
   * The content of the modal, usually JSX elements or React components.
   * This defines what is displayed inside the modal.
   */
  children?: ReactNode;

  /**
   * Callback function to be executed when the "Continue" action is triggered within the modal.
   * This function is usually called when the user clicks the continue button.
   */
  onContinueHandler: () => void;
  onContinueLabel?: string;
  /**
   * Optional callback function to be executed when the "Close" action is triggered within the modal.
   * This function is usually called when the user clicks the close button.
   */
  onCloseHandler?: () => void;
  onCloseLabel?: string;

  title?: string;
};

export type OpenModalProps = Omit<ModalSliceInitialState, "isModalOpen">;
