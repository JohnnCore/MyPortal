// IssueForm.tsx (Fixed version)
import React from "react";
import { forwardRef, useCallback, useImperativeHandle } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import IssueFormInput from "./IssueFormInput/IssueFormInput";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { IssueFormData } from "./IssueForm.types";
import {
  openDiscardModal,
  openModal,
  updateAPIMutationLoadingState,
} from "../../../redux/modal/modalSlice";
import { Issue, IssueResponse } from "../../../types/board";

interface IssueFormProps {
  existingIssue: IssueResponse | null;
  onFormSubmit: (values: Issue) => Promise<void>;
  onCancel: () => void;
}

interface IssueFormRef {
  triggerCancel: (e?: React.MouseEvent) => void;
}

const IssueForm = forwardRef<IssueFormRef, IssueFormProps>(
  ({ existingIssue, onFormSubmit, onCancel }, ref) => {
    const dispatch = useAppDispatch();

    const {
      register,
      handleSubmit,
      reset,
      // clearErrors, // Add this
      formState: { errors, isSubmitting, isDirty },
      control,
      watch,
    } = useForm<IssueFormData>({
      defaultValues: existingIssue || {
        title: "",
        projectId: 0,
        reporter: 0,
        statusId: 0,
        description: "",
        typeId: 0,
        priorityId: 0,
        assignee: 0,
        tags: [],
        confirmSubmission: false,
      },
      mode: "onBlur",
    });

    const showConfirmationModal = useCallback(
      (data: IssueFormData) => {
        dispatch(
          openModal({
            title: "Confirm Submission",
            content: {
              title: "Confirm Issue Submission",
              children: (
                <div className="text-gray-600">
                  <p className="mb-4">
                    Are you sure you want to submit this issue?
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
                    <p>
                      <strong>Title:</strong> {data.title}
                    </p>
                    <p>
                      <strong>Priority:</strong> {data.priorityId}
                    </p>
                    <p>
                      <strong>Type:</strong> {data.typeId}
                    </p>
                    <p>
                      <strong>Assignee:</strong> {data.assignee}
                    </p>
                  </div>
                </div>
              ),
              buttons: {
                primary: {
                  text: isSubmitting ? "Submitting..." : "Confirm Submit",
                  handler: async () => {
                    dispatch(
                      updateAPIMutationLoadingState({ isLoading: true })
                    );
                    await onFormSubmit(data);
                  },
                },
                secondary: { text: "Cancel" },
              },
            },
            size: "large",
          })
        );
      },
      [dispatch, onFormSubmit, isSubmitting]
    );

    const handleCancelClick = useCallback(
      (e?: React.MouseEvent) => {
        // Prevent default behavior and stop propagation
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        // Clear any existing errors first
        // clearErrors();

        if (!isDirty) {
          onCancel();
          return;
        }

        dispatch(
          openDiscardModal({
            title: "Discard Changes",
            children: (
              <div className="text-gray-600">
                <p>Are you sure you want to cancel and lose your changes?</p>
                <p className="mt-2 text-sm text-gray-500">
                  All unsaved data will be permanently lost.
                </p>
              </div>
            ),
            onContinueHandler: () => {
              reset();
              onCancel();
            },
            onCloseLabel: "Keep Editing",
            onContinueLabel: "Discard Changes",
          })
        );
      },
      [dispatch, reset, onCancel, isDirty]
    );

    useImperativeHandle(ref, () => ({
      triggerCancel: (e?: React.MouseEvent) => {
        handleCancelClick(e as React.MouseEvent);
      },
    }));

    return (
      <form className="space-y-6">
        <IssueFormInput
          register={register}
          control={control}
          errors={errors}
          watch={watch}
          isDisabled={isSubmitting}
        />

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleCancelClick(e);
            }}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(
              showConfirmationModal as SubmitHandler<IssueFormData>
            )}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? "Submitting..."
              : existingIssue
              ? "Update Issue"
              : "Create Issue"}
          </button>
        </div>
      </form>
    );
  }
);

IssueForm.displayName = "IssueForm";

export default IssueForm;
