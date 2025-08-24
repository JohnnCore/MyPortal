// Board.tsx (Main Page - Updated)
import { useCallback, useState } from "react";
import CardBoard from "./Card/CardBoard";
import { issuesStatues, issues } from "../../mocks";
import IssueForm from "./IssueForm/IssueForm";
import { IssueData, IssueFormValues } from "./IssueForm/types";
import Modal from "../common/Modal/Modal";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { openDiscardModal } from "../../redux/modal/modalSlice";

const Board = () => {
  const dispatch = useAppDispatch();
  const [existingIssue, setExistingIssue] = useState<IssueData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const submitIssue = useCallback(
    async (values: IssueFormValues) => {
      return new Promise<{
        data: IssueData;
        success: boolean;
        message: string;
      }>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            const newIssue: IssueData = {
              id: existingIssue?.id || `issue-${Date.now()}`,
              title: values.title,
              description: values.description,
              priority: values.priority,
              type: values.type,
              assignee: values.assignee,
              dueDate: values.dueDate,
              tags: values.tags,
              status: values.status,
              createdAt: existingIssue?.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            resolve({
              data: newIssue,
              success: true,
              message: existingIssue
                ? "Issue updated successfully"
                : "Issue created successfully",
            });
          } else {
            reject(new Error("Failed to submit issue. Please try again."));
          }
        }, 1500);
      });
    },
    [existingIssue]
  );

  const handleFormSubmit = useCallback(
    async (values: IssueFormValues): Promise<void> => {
      setError(null);
      setSuccessMessage(null);
      setIsLoading(true);

      try {
        const response = await submitIssue(values);

        if (response.success) {
          setExistingIssue(response.data);
          setSuccessMessage(response.message);
          setShowFormModal(false);

          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [submitIssue]
  );

  const handleFormReset = useCallback(() => {
    setExistingIssue(null);
    setError(null);
    setSuccessMessage(null);
    setShowFormModal(false);
  }, []);

  const handleCreateClick = useCallback(() => {
    setExistingIssue(null);
    setError(null);
    setSuccessMessage(null);
    setShowFormModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    // Show discard confirmation if there are changes
    dispatch(
      openDiscardModal({
        title: "Discard Changes?",
        children: (
          <div className="text-gray-600">
            <p>Are you sure you want to close without saving?</p>
            <p className="mt-2 text-sm text-gray-500">
              All unsaved changes will be lost.
            </p>
          </div>
        ),
        onContinueHandler: () => {
          setShowFormModal(false);
          setError(null);
          setSuccessMessage(null);
        },
        onCloseHandler: () => {
          // Keep the modal open
        },
        onContinueLabel: "Discard",
        onCloseLabel: "Keep Editing",
      })
    );
  }, [dispatch]);

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Work Items Board
        </h1>
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Issue
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 min-h-screen">
        {issuesStatues.map((status) => (
          <div
            key={status}
            className="flex-1 min-w-[250px] p-2 rounded-md bg-gray-200 dark:bg-gray-950"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {status}
            </h2>
            <div className="space-y-4">
              {issues
                .filter((item) => item.status === status)
                .map((item) => (
                  <CardBoard key={item.id} item={item} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {showFormModal && (
        <Modal
          isOpen={showFormModal}
          onClose={handleCloseModal}
          title={existingIssue ? "Edit Issue" : "Create New Issue"}
          size="large"
        >
          <IssueForm
            existingIssue={existingIssue}
            onSubmit={handleFormSubmit}
            onReset={handleFormReset}
            isSubmitting={isLoading}
          />
        </Modal>
      )}
    </div>
  );
};

export default Board;
