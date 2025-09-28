import React, { useCallback, useState, lazy, Suspense, useRef } from "react";

import Modal from "../../components/common/Modal/Modal";
// import IssueForm from "../../components/board/IssueForm/IssueForm";
import Board from "../../components/board/Board/Board";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { IssueFormData } from "../../components/board/IssueForm/IssueForm.types";
import { openDiscardModal } from "../../redux/modal/modalSlice";
import PageContainer from "../../components/common/PageContainer/PageContainer";
import Header from "../../components/board/Board/Header/Header";
import { Issue, IssueResponse } from "../../types/board";
import { useIssues } from "../../hooks/Issues/useIssues";
import { useCreateIssueMutation } from "../../redux/api/Issues/issuesApiSlice";
import { useMetaStatuses } from "../../hooks/Meta/useMeta";

interface IssueFormRef {
  triggerCancel: (e?: React.MouseEvent) => void;
}

export default function BoardPage() {
  const { data: issues, isError, isFetching, error, isSuccess } = useIssues();
  const [createIssue, { isError: createError, isLoading: loadingError }] =
    useCreateIssueMutation();

  console.log(issues);

  const { data: issuesStatues } = useMetaStatuses();

  // console.log(issuesStatues);

  const [existingIssue, setExistingIssue] = useState<IssueResponse | null>(
    null
  );
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const issueFormRef = useRef<IssueFormRef>(null);

  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const IssueForm = lazy(
    () => import("./../../components/board/IssueForm/IssueForm")
  );

  const preloadIssueForm = () => {
    import("./../../components/board/IssueForm/IssueForm");
  };

  // const submitIssue = useCallback(
  //   async (values: IssueFormValues) => {
  //     console.log("submitting issue...");

  //     return new Promise<{
  //       data: IssueData;
  //       success: boolean;
  //       message: string;
  //     }>((resolve, reject) => {
  //       setTimeout(() => {
  //         if (Math.random() > 0.1) {
  //           const newIssue: IssueData = {
  //             id: existingIssue?.id || 0,
  //             title: values.title,
  //             description: values.description,
  //             priority: values.priority,
  //             type: values.type,
  //             assignee: values.assignee,
  //             tags: values.tags,
  //             status: values.status,
  //             createdAt: existingIssue?.createdAt || new Date().toISOString(),
  //             updatedAt: new Date().toISOString(),
  //           };

  //           resolve({
  //             data: newIssue,
  //             success: true,
  //             message: existingIssue
  //               ? "Issue updated successfully"
  //               : "Issue created successfully",
  //           });
  //         } else {
  //           reject(new Error("Failed to submit issue. Please try again."));
  //         }
  //       }, 2000); // Reduced timeout for better UX
  //     });
  //   },
  //   [existingIssue]
  // );

  // const handleFormSubmit = useCallback(
  //   async (values: IssueFormValues): Promise<void> => {
  //     setError(null);
  //     setSuccessMessage(null);
  //     setIsLoading(true);

  //     try {
  //       const response = await submitIssue(values);

  //       if (response.success) {
  //         setExistingIssue(response.data);
  //         setSuccessMessage(response.message);
  //         setShowFormModal(false);

  //         setTimeout(() => {
  //           setSuccessMessage(null);
  //         }, 3000);
  //       }
  //     } catch (err: any) {
  //       setError(err.message || "An unexpected error occurred");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [submitIssue]
  // );

  const handleFormSubmit = useCallback(
    async (values: Issue): Promise<void> => {
      try {
        const response = await createIssue(values);
        console.log(response);

        if (response.data) {
          console.log("Issue created:", response);
          setShowFormModal(false);
        }
      } catch (err: any) {
        console.log("Error creating issue:", err);
      } finally {
        console.log("Closing modal...");
      }
    },
    [createIssue]
  );

  const handleFormCancel = useCallback(() => {
    setShowFormModal(false);
    setExistingIssue(null);
  }, []);

  const handleCreateClick = useCallback(() => {
    setExistingIssue(null);
    setShowFormModal(true);
  }, []);

  // const handleCloseModal = useCallback(() => {
  //   setShowFormModal(false);
  //   setError(null);
  //   setSuccessMessage(null);
  // }, []);

  // const handleCloseModalWithConfirmation = useCallback(() => {
  //   // If editing an existing issue, show confirmation
  //   if (existingIssue) {
  //     dispatch(
  //       openDiscardModal({
  //         title: "Discard Changes",
  //         children: (
  //           <div className="text-gray-600">
  //             <p>Are you sure you want to close without saving your changes?</p>
  //             <p className="mt-2 text-sm text-gray-500">
  //               All unsaved data will be permanently lost.
  //             </p>
  //           </div>
  //         ),
  //         onContinueHandler: () => {
  //           handleFormCancel();
  //         },
  //         onCloseLabel: "Keep Editing",
  //         onContinueLabel: "Discard Changes",
  //       })
  //     );
  //   }
  //   handleFormCancel();
  // }, [dispatch, handleFormCancel, existingIssue]);

  const handleCloseModalWithConfirmation = useCallback(() => {
    issueFormRef.current?.triggerCancel();
  }, [issueFormRef]);

  const handleIssueClick = useCallback((clickedIssue: IssueResponse) => {
    // Find the full issue data from your issues array

    // if (clickedIssue) {
    //   // Convert Issue to IssueData format if needed
    //   const issueData: IssueResponse = {
    //     id: clickedIssue.id,
    //     title: clickedIssue.title, // Assuming summary maps to title
    //     description: clickedIssue.description,
    //     priority: clickedIssue.priority || "Low", // Provide default if needed
    //     type: clickedIssue.type,
    //     assignee: clickedIssue.assignee, // Provide default if needed
    //     tags: clickedIssue.tags || [], // Provide default if needed
    //     status: clickedIssue.status,
    //     createdAt: clickedIssue.createdAt || new Date().toISOString(),
    //     updatedAt: clickedIssue.updatedAt || new Date().toISOString(),
    //   };

    //   setExistingIssue(issueData);
    //   setShowFormModal(true);
    // }

    setExistingIssue(clickedIssue);
    setShowFormModal(true);
  }, []);

  return (
    <PageContainer>
      <div className="">
        <Header onCreateIssue={handleCreateClick} onHover={preloadIssueForm} />
        {/* Success/Error Messages */}
        {isSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            Saved
          </div>
        )}
        {isError && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {/* {error} */}
          </div>
        )}

        {isFetching && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
            Loading...
          </div>
        )}

        <Board
          issues={issues?.data}
          issuesStatues={issuesStatues?.data}
          onIssueClick={handleIssueClick}
        />

        {showFormModal && (
          <Suspense fallback={<div>Loading...</div>}>
            <Modal
              isOpen={showFormModal}
              onClose={handleCloseModalWithConfirmation}
              title={existingIssue ? "Edit Issue" : "Create New Issue"}
              size="large"
            >
              <IssueForm
                existingIssue={existingIssue}
                onFormSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                ref={issueFormRef}
              />
            </Modal>
          </Suspense>
        )}
      </div>
    </PageContainer>
  );
}
