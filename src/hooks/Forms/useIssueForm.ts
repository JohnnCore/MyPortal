import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useForm, UseFormReturn } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import type { IssueWithRelations } from '../../types';
import { IssueFormData, IssueFormSchema } from '../../schemas/IssueForm.schema';

interface UseIssueFormProps {
  existingIssue?: IssueWithRelations | null;
  projectId: number;
  onSubmit?: (data: IssueFormData) => Promise<void>;
  onCancel?: () => void;
}

interface UseIssueFormReturn {
  form: UseFormReturn<IssueFormData>;
  mode: 'create' | 'update';
  isDirty: boolean;
  isSubmitting: boolean;
  handleCancel: () => boolean;
  handleFormSubmit: (data: IssueFormData) => Promise<void>;
}

/**
 * Converts an IssueResponse to IssueFormData, handling type mismatches
 */
const issueToFormData = (issue: IssueWithRelations): IssueFormData => ({
  projectId: issue.projectId,
  title: issue.title,
  description: issue.description ?? '',
  priorityId: issue.priorityId,
  typeId: issue.typeId,
  statusId: issue.statusId,
  confirmSubmission: false,
  assigneeUser: issue.assigneeUser
    ? { id: issue.assigneeUser.id, name: issue.assigneeUser.username || issue.assigneeUser.email }
    : undefined,
  tags: issue.tags?.map((tag) => ({ id: tag.id, name: tag.name })) ?? [],
});

const getDefaultFormData = (projectId: number): IssueFormData => ({
  title: '',
  description: '',
  projectId,
  statusId: 0,
  typeId: 0,
  priorityId: 0,
  assigneeUser: undefined,
  tags: [],
  confirmSubmission: false,
});

export const useIssueForm = ({
  existingIssue,
  projectId,
  onSubmit,
  onCancel,
}: UseIssueFormProps): UseIssueFormReturn => {
  const mode = useMemo<'create' | 'update'>(
    () => (existingIssue ? 'update' : 'create'),
    [existingIssue]
  );

  const defaultValues = useMemo(
    () => (existingIssue ? issueToFormData(existingIssue) : getDefaultFormData(projectId)),
    [existingIssue, projectId]
  );

  const form = useForm<IssueFormData>({
    defaultValues,
    resolver: zodResolver(IssueFormSchema),
    mode: 'onBlur',
  });

  const { reset, formState } = form;

  const hasInitialized = useRef(false);
  const previousIssueJson = useRef<string | null>(null);

  // Reset form when existingIssue changes or when switching between create/edit modes
  useEffect(() => {
    const serialized = existingIssue ? JSON.stringify(existingIssue) : null;

    // Check if issue changed or mode changed (create vs edit)
    if (serialized !== previousIssueJson.current) {
      previousIssueJson.current = serialized;

      if (existingIssue) {
        // Edit mode - populate with issue data
        reset(issueToFormData(existingIssue));
      } else {
        // Create mode - reset to defaults
        reset(getDefaultFormData(projectId));
      }

      hasInitialized.current = true;
    }
  }, [existingIssue, reset, projectId]);

  const handleCancel = useCallback(() => {
    if (formState.isDirty) return false;
    reset();
    onCancel?.();
    return true;
  }, [formState.isDirty, reset, onCancel]);

  const handleFormSubmit = useCallback(
    async (data: IssueFormData) => {
      await onSubmit?.(data);
      // Do not reset here; let parent handle reset after confirmation
    },
    [onSubmit]
  );

  return {
    form,
    mode,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    handleCancel,
    handleFormSubmit,
  };
};
