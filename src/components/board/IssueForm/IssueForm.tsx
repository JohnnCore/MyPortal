// IssueForm.tsx (Middle Layer - Updated)
import { useRef, useState, useCallback } from "react";
import IssueFormInput from "./IssueFormInput";
import { IssueFormValues, IssueData, ImperativeFormHandle } from "./types";
import { validationFunctions } from "./utils";
import { useAppDispatch } from "../../../hooks/reduxHooks";
import { openDiscardModal, openModal } from "../../../redux/modal/modalSlice";

interface IssueFormProps {
  existingIssue: IssueData | null;
  onSubmit: (values: IssueFormValues) => Promise<void>;
  onReset: () => void;
  isSubmitting: boolean;
}

const IssueForm = ({
  existingIssue,
  onSubmit,
  onReset,
  isSubmitting,
}: IssueFormProps) => {
  const formRef = useRef<ImperativeFormHandle>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const dispatch = useAppDispatch();

  const defaultFormValues: IssueFormValues = {
    title: "",
    status: "To Do",
    description: "",
    type: "Task",
    priority: "Low",
    assignee: "",
    dueDate: "",
    tags: [],
    confirmSubmission: false,
  };

  const initialValues: IssueFormValues = existingIssue
    ? {
        title: existingIssue.title,
        type: existingIssue.type,
        status: existingIssue.status,
        description: existingIssue.description,
        priority: existingIssue.priority,
        assignee: existingIssue.assignee,
        dueDate: existingIssue.dueDate,
        tags: existingIssue.tags,
        confirmSubmission: false,
      }
    : defaultFormValues;

  const handleSubmitClick = useCallback(() => {
    console.log("handleSubmitClick called");

    if (!formRef.current) return;

    const formValues = formRef.current.values;

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
                  <strong className="text-gray-800">Title:</strong>{" "}
                  {formValues.title}
                </p>
                <p>
                  <strong className="text-gray-800">Priority:</strong>{" "}
                  {formValues.priority}
                </p>
                <p>
                  <strong className="text-gray-800">Type:</strong>{" "}
                  {formValues.type}
                </p>
                <p>
                  <strong className="text-gray-800">Assignee:</strong>{" "}
                  {formValues.assignee}
                </p>
                <p>
                  <strong className="text-gray-800">Due Date:</strong>{" "}
                  {formValues.dueDate}
                </p>
              </div>
            </div>
          ),
          buttons: {
            primary: {
              text: isSubmitting ? "Submitting..." : "Confirm Submit",
              handler: async () => {
                try {
                  if (formRef.current) {
                    await onSubmit(formRef.current.values);
                  }
                } catch (error) {
                  console.error("Error submitting form:", error);
                }
              },
            },
            secondary: {
              text: "Cancel",
              handler: () => {
                // Just close modal, keep form data
              },
            },
          },
        },
        size: "large",
      })
    );
  }, [dispatch, onSubmit, isSubmitting]);

  const handleSubmit = useCallback(async () => {
    if (formRef.current) {
      const { errors, isValid } = await formRef.current.handleSubmit();

      if (isValid) {
        setFormErrors([]);
        handleSubmitClick();
      } else {
        // Display form validation errors WITHOUT resetting the form
        const errorStrings = Object.values(errors ?? {}).filter(
          (error): error is string => !!error && typeof error === "string"
        );
        setFormErrors(errorStrings);
      }
    }
  }, [handleSubmitClick]);

  const handleCancel = useCallback(() => {
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
          if (formRef.current) {
            formRef.current.handleReset();
          }
          setFormErrors([]);
          onReset();
        },
        onCloseHandler: () => {
          // Just close modal, keep form data
        },
        onContinueLabel: "Discard Changes",
        onCloseLabel: "Keep Editing",
      })
    );
  }, [dispatch, onReset]);

  return (
    <div className="space-y-6">
      {/* Display Form Errors */}
      {formErrors.length > 0 && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <h4 className="font-medium mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside space-y-1">
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <IssueFormInput
        ref={formRef}
        initialValues={initialValues}
        validationFunctions={validationFunctions}
        isDisabled={isSubmitting}
        onFormSubmit={handleSubmitClick}
      />

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
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
    </div>
  );
};

export default IssueForm;
