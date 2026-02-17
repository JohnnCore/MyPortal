import { useCallback, useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams, useSearchParams } from 'react-router';

import { BOARD } from '../../routes/paths';
import { parseId } from '../../utils/parseId';
import { useAuth } from '../Auth/useAuth';
import { useIssue, useUpdateIssue } from '../Issues/useIssue';
import { useMetaData } from '../Meta/useMetaData';
import { useRenameStatus } from '../Meta/useMeta';
import { useProjectMembers } from '../Projects/useProject';
import type { MetaBase, UserSafe } from '../../types';

/**
 * Custom hook that encapsulates all business logic for the IssueDetail component.
 * Separates concerns: data fetching, state management, and handlers from the UI layer.
 */
export const useIssueDetail = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [searchParams] = useSearchParams();
  const selectedIssue = searchParams.get('selectedIssue');

  // Parse and validate IDs
  const projectIdNumber = parseId(projectId);
  const idNumber = parseId(selectedIssue);
  const isValidIds = projectIdNumber !== null && idNumber !== null;

  // Local UI state
  const [activeTab, setActiveTab] = useState('Comments');
  const [showDev, setShowDev] = useState(false);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  // Auth
  const { user: currentUser } = useAuth();

  // Data fetching hooks
  const { issue, isLoading: isIssueLoading } = useIssue({
    id: idNumber,
    projectId: projectIdNumber,
  });

  const { handleRenameStatus } = useRenameStatus({
    projectId: projectIdNumber,
  });

  const { metaData, isLoading: isMetaDataLoading } = useMetaData({
    projectId: projectIdNumber,
  });

  const { handleUpdate } = useUpdateIssue({ id: idNumber, projectId: projectIdNumber });
  const { projectMembers } = useProjectMembers(projectIdNumber);

  // Navigate away if IDs are invalid
  useEffect(() => {
    if (!isValidIds) {
      navigate(generatePath(BOARD, { projectId: projectId! }));
    }
  }, [isValidIds, navigate, projectId]);

  // Computed state
  const isLoading = isIssueLoading || isMetaDataLoading;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleAssignToMe = useCallback(() => {
    if (!currentUser || !issue?.data) {
      return;
    }
    handleUpdate({
      assigneeUser: currentUser,
      assigneeId: currentUser.id,
    });
    setShowAssigneeDropdown(false);
  }, [currentUser, issue?.data, handleUpdate]);

  const handleAssigneeChange = useCallback(
    (assigneeUser: UserSafe | null) => {
      if (!issue?.data) return;
      handleUpdate({
        ...issue.data,
        assigneeUser: assigneeUser === null ? null : assigneeUser,
        assigneeId: assigneeUser === null ? null : assigneeUser.id,
      });
      setShowAssigneeDropdown(false);
    },
    [issue?.data, handleUpdate]
  );

  const handleLabelsChange = useCallback(
    (selectedTags: MetaBase[]) => {
      if (!issue?.data) return;
      handleUpdate({
        tags: selectedTags,
      });
    },
    [issue?.data, handleUpdate]
  );

  const handleClose = useCallback(() => {
    navigate(generatePath(BOARD, { projectId: projectId! }));
  }, [navigate, projectId]);

  const handleTitleUpdate = useCallback(
    (newTitle: string) => {
      handleUpdate({ title: newTitle });
    },
    [handleUpdate]
  );

  const handleDescriptionUpdate = useCallback(
    (newDescription: string) => {
      handleUpdate({ description: newDescription });
    },
    [handleUpdate]
  );

  const handleStatusUpdate = useCallback(
    (statusId: number) => {
      handleUpdate({ statusId });
    },
    [handleUpdate]
  );

  // Placeholder handlers for features under development
  const handleAddEpic = useCallback(() => {
    // TODO: Implement add epic functionality
  }, []);

  const handleLockIssue = useCallback(() => {
    // TODO: Implement lock issue functionality
  }, []);

  const handleCopyLink = useCallback(() => {
    // TODO: Implement copy link functionality
  }, []);

  const handleMoreOptions = useCallback(() => {
    // TODO: Implement more options functionality
  }, []);

  const handleExpand = useCallback(() => {
    // TODO: Implement expand modal functionality
  }, []);

  const handleConfigureAutomation = useCallback(() => {
    // TODO: Implement configure automation functionality
  }, []);

  const toggleAssigneeDropdown = useCallback(() => {
    setShowAssigneeDropdown((prev) => !prev);
  }, []);

  const closeAssigneeDropdown = useCallback(() => {
    setShowAssigneeDropdown(false);
  }, []);

  const toggleDev = useCallback(() => {
    setShowDev((prev) => !prev);
  }, []);

  return {
    // IDs
    projectId: projectIdNumber,
    issueId: idNumber,
    isValidIds,

    // Data
    issue: issue?.data ?? null,
    metaData,
    projectMembers,
    currentUser,

    // Loading state
    isLoading,

    // UI state
    activeTab,
    setActiveTab,
    showDev,
    toggleDev,
    showAssigneeDropdown,
    toggleAssigneeDropdown,
    closeAssigneeDropdown,

    // Handlers
    handlers: {
      close: handleClose,
      updateTitle: handleTitleUpdate,
      updateDescription: handleDescriptionUpdate,
      updateStatus: handleStatusUpdate,
      renameStatus: handleRenameStatus,
      assignToMe: handleAssignToMe,
      changeAssignee: handleAssigneeChange,
      changeLabels: handleLabelsChange,
      addEpic: handleAddEpic,
      lockIssue: handleLockIssue,
      copyLink: handleCopyLink,
      moreOptions: handleMoreOptions,
      expand: handleExpand,
      configureAutomation: handleConfigureAutomation,
    },
  };
};
