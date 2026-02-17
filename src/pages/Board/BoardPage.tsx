// pages/BoardPage.tsx
import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import {
  addNotification,
  createErrorNotification,
} from '../../redux/notifications/notificationsSlice';

import { useParams, useSearchParams } from 'react-router';

import { parseId } from '../../utils/parseId';
import Modal from '../../components/common/Modal/Modal';
import { useIssueBoard } from '../../hooks/useIssuesBoard';
import Header from '../../components/board/Board/Header/Header';
import IssueBoardHeader from '../../components/issue-board/IssueBoardHeader/IssueBoardHeader';
import IssueBoard from '../../components/issue-board/IssuesBoard/IssuesBoard';
import PageContainer from '../../components/common/PageContainer/PageContainer';
import Spinner from '../../components/common/Spinner/Spinner';

import { useCreateProjectInvite } from '../../hooks/ProjectInvites/useProjectInvite';
import type { FormRef } from '../../types/ui';
import { useProject } from '../../hooks/Projects/useProject';

// Lazy load modals for better initial bundle size
const IssueForm = lazy(() => import('./../../components/board/IssueForm/IssueForm'));
const IssueDetail = lazy(() => import('../../components/board/IssueDetail/IssueDetail'));

export default function BoardPage() {
  const dispatch = useAppDispatch();

  const { projectId } = useParams();
  const [searchParams] = useSearchParams();

  const projectIdNumber = parseId(projectId);

  const selectedIssueId = searchParams.get('selectedIssue');

  const issueFormRef = useRef<FormRef>(null);

  // State for invite link
  const [inviteLink, setInviteLink] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  // Determine current tab based on the URL
  const { tab } = useParams();
  const currentTab = tab || 'board';

  // All business logic extracted to custom hook
  // Skip fetching issues when on list tab (IssuesList has its own infinite query)
  const {
    issues,
    statuses,
    priorities,
    types,
    projectMembers,
    isLoading,
    isError,
    error,
    showFormModal,
    existingIssue,
    handleCreateClick,
    handleFormSubmit,
    handleCreateCard,
    handleFormCancel,
    handleReorderIssue,
    handleRenameStatus,
    handleReorderStatus,
    preloadForm,
    filters,
    setFilter,
    clearFilters,
  } = useIssueBoard({
    projectId: projectIdNumber,
    skipIssuesFetch: currentTab === 'list',
  });

  // Handle modal close with form confirmation
  const handleCloseModalWithConfirmation = () => {
    issueFormRef.current?.triggerCancel();
  };

  const { handleCreateInvite: createProjectInvite } = useCreateProjectInvite({
    projectId: projectIdNumber,
  });

  const { data: projectData } = useProject({ id: projectIdNumber });

  const handleCreateInvite = useCallback(async () => {
    if (!projectIdNumber) return;

    // If we already have an invite link, don't generate a new one
    if (inviteLink) return;

    setIsGeneratingLink(true);

    try {
      const res = await createProjectInvite({
        email: 's',
        projectId: projectIdNumber,
      });
      const token = res?.data?.token;
      if (!token) {
        throw new Error('Invite token not returned');
      }

      const invitePath = `/invite/${token}`;
      const inviteUrl = `${window.location.origin}${invitePath}`;

      setInviteLink(inviteUrl);
    } catch (err) {
      dispatch(addNotification(createErrorNotification('Failed to create invite.')));
      console.error('Failed to create invite:', err);
    } finally {
      setIsGeneratingLink(false);
    }
  }, [createProjectInvite, dispatch, projectIdNumber, inviteLink]);

  if (!projectIdNumber) {
    return (
      <PageContainer>
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          Project ID is missing or invalid in the URL.
        </div>
      </PageContainer>
    );
  }

  // Check if we have the required data
  const hasData = issues && statuses && types && priorities;

  return (
    <PageContainer>
      <Header
        onCreateIssue={handleCreateClick}
        onHover={preloadForm}
        onCreateInvite={handleCreateInvite}
        title={projectData?.data?.name}
        members={projectMembers}
        inviteLink={inviteLink}
        isGeneratingLink={isGeneratingLink}
      />

      {hasData && <IssueBoardHeader projectId={projectIdNumber} />}

      {isError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error && 'message' in error ? error.message : 'Failed to load issues'}
        </div>
      )}

      {isLoading && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
          Loading issues...
        </div>
      )}

      {hasData && (
        <IssueBoard
          issues={issues}
          statuses={statuses}
          priorities={priorities}
          types={types}
          projectMembers={projectMembers}
          projectId={projectIdNumber}
          currentTab={currentTab}
          isLoading={isLoading}
          onReorder={handleReorderIssue}
          onReorderStatus={handleReorderStatus}
          onRenameStatus={handleRenameStatus}
          onCreateCard={handleCreateCard}
          filters={filters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
        />
      )}

      {showFormModal && (
        <Suspense fallback={<div>Loading form...</div>}>
          <Modal
            isOpen={showFormModal}
            onClose={handleCloseModalWithConfirmation}
            title={existingIssue ? 'Edit Issue' : 'Create New Issue'}
            size="large"
          >
            <IssueForm
              existingIssue={existingIssue}
              projectId={projectIdNumber}
              onFormSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              ref={issueFormRef}
            />
          </Modal>
        </Suspense>
      )}
      {selectedIssueId && (
        <Suspense fallback={<Spinner />}>
          <IssueDetail />
        </Suspense>
      )}
    </PageContainer>
  );
}
