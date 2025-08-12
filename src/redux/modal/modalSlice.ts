import { createSlice } from "@reduxjs/toolkit";
import { initialState, defaultDiscardChildren } from "./initialState";
import { DiscardModalProps, OpenModalProps } from "./modalSlice.types";

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        /**
         * Closes the discard modal by resetting the modal state to its initial value.
         * This action is typically used to close any open modal and clear its state.
         */
        closeModal: () => initialState,

        /**
         * Update the loading state of the API mutation.
         * This action is used to set the loading state of the modal.
         * It can be used to indicate that an API call is in progress.
         * The loading state can be used to show a spinner or loading indicator in the modal.
         * @param payload.isLoading - The new loading state to set.
         * @returns
         */
        updateAPIMutationLoadingState: (
            state,
            { payload }: { payload: { isLoading: boolean } }
        ) => {
            return {
                ...state,
                isLoading: payload.isLoading,
            };
        },

        /**
         * Opens a modal with the provided configuration.
         * This action updates the modal state with the provided payload.
         *
         * @param {ModalSliceInitialState} state - The current state of the modal.
         * @param {OpenModalProps} payload - The new state to replace the current modal state.
         * @returns {ModalSliceInitialState} The new state for the modal.
         */
        openModal: (state, { payload }: { payload: OpenModalProps }) => ({
            ...state, // IDK
            isModalOpen: true,
            ...payload,
            //   title: payload.title || "Modal
        }),

        /**
         * Opens a discard modal with custom handlers for "Continue" and "Close" actions.
         * This action updates the modal state to display a discard confirmation dialog.
         *
         * The content of the modal includes a default message asking the user if they want to discard their changes.
         * If a different message or content is desired, a custom `children` can be provided in the payload.
         * Otherwise, the modal will use the default `children` content specified by `defaultDiscardChildren`.
         *
         * @param {ModalSliceInitialState} state - The current state of the modal.
         * @param {DefaultPropsTest} payload - Contains the open state, optional custom children, and handler functions for the modal.
         * @returns {DiscardModalProps} The new state for the discard modal.
         */
        openDiscardModal: (state, { payload }: { payload: DiscardModalProps }) => {
            const {
                children = defaultDiscardChildren,
                onContinueHandler,
                onCloseHandler,
                title,
                onCloseLabel,
                onContinueLabel,
            } = payload;

            state.title = title || 'Discard Modal';
            state.isModalOpen = true;

            // Mutate the nested 'content' object
            state.content.title = title || 'Discard Confirmation';
            state.content.children = children;

            // Mutate the nested 'buttons' object and its properties
            state.content.buttons.primary.text = onContinueLabel || 'Confirm';
            state.content.buttons.primary.handler = onContinueHandler;
            state.content.buttons.secondary.text = onCloseLabel || 'Dismiss';
            state.content.buttons.secondary.handler = onCloseHandler;


            // return {
            //     ...state, // IDK
            //     title: title || "Discard Modal",
            //     isModalOpen: true,
            //     content: {
            //         title: title || "Discard Confirmation",
            //         children,
            //         buttons: {
            //             primary: {
            //                 text: onContinueLabel || "Confirm",
            //                 handler: onContinueHandler,
            //             },
            //             secondary: {
            //                 text: onCloseLabel || "Dismiss",
            //                 handler: onCloseHandler,
            //             },
            //         },
            //     },
            // };
        },
    },
});

export const {
    closeModal,
    openModal,
    openDiscardModal,
    updateAPIMutationLoadingState,
} = modalSlice.actions;

export default modalSlice.reducer;
