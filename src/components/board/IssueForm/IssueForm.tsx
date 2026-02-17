import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  type MouseEvent,
} from 'react';

import type { User } from '../../../types/domain/user';
import IssueFormInput from './IssueFormInput/IssueFormInput';

import { useProjects, useProjectMembers } from '../../../hooks/Projects/useProject';
import { useDiscardDialog } from '../../../hooks/Modals/useDiscardModal';
import DiscardDialog from '../../common/Modal/DiscardModal/DiscardModal';

import { useConfirmDialog } from '../../../hooks/Modals/useConfirmationModal';
import ConfirmDialog from '../../common/Modal/ConfirmationModal/ConfirmationModal';

import { type MetaData, useMetaData } from '../../../hooks/Meta/useMetaData';
import { getNameFromMetadata } from '../../../utils/helpers';

import { IssueFormData } from '../../../schemas/IssueForm.schema';
import { useIssueForm } from '../../../hooks/Forms/useIssueForm';
import { IssueFormProps, IssueFormRef } from './IssueForm.types';
import { CreateIssueDTO } from '../../../types';
import Button from '../../common/Button/Button';

const IssueForm = forwardRef<IssueFormRef, IssueFormProps>(
  ({ existingIssue, projectId = 0, onFormSubmit, onCancel }, ref) => {
    const { form, isDirty, isSubmitting, handleFormSubmit } = useIssueForm({
      existingIssue,
      projectId,
      onSubmit: handleSubmitWrapper,
      onCancel,
    });

    const {
      register,
      control,
      watch,
      formState: { errors },
    } = form;

    const selectedProjectId = watch('projectId') || projectId;

    const { metaData, isLoading: metaLoading } = useMetaData({
      projectId: selectedProjectId,
    });

    const { projects, isLoading: projectsLoading } = useProjects();
    const { projectMembers, isLoading: projectMembersLoading } =
      useProjectMembers(selectedProjectId);

    const isLoading = metaLoading || projectsLoading || projectMembersLoading;

    const dropdownValues = useMemo(() => {
      const mapUserToMeta = (u: User) => ({
        id: Number(u?.id),
        name: u?.username || u?.email || 'Unknown',
      });

      return {
        metaData: metaData ?? {},
        projects: projects ?? [],
        projectMembers: (projectMembers ?? []).map(mapUserToMeta),
      };
    }, [metaData, projects, projectMembers]);

    async function handleSubmitWrapper(data: IssueFormData) {
      if (!isLoading && metaData) {
        return await handleSubmit(data, dropdownValues.metaData);
      }
    }

    const confirmDialog = useConfirmDialog();

    const handleSubmit = useCallback(
      async (data: IssueFormData, metaSnapshot: MetaData) => {
        const summaryMessage = `
          Project: ${data.projectId}
          Title: ${data.title}
          Priority: ${getNameFromMetadata(data.priorityId, metaSnapshot.priorities)}
          Type: ${getNameFromMetadata(data.typeId, metaSnapshot.types)}
          Assignee: ${data.assigneeUser?.name || 'Unassigned'}

          Are you sure you want to ${existingIssue ? 'update' : 'create'} this issue?
        `.trim();

        await confirmDialog.confirmAsync(
          {
            title: existingIssue ? 'Update Issue' : 'Create Issue',
            message: summaryMessage,
            confirmText: existingIssue ? 'Update' : 'Create',
            cancelText: 'Cancel',
          },
          async () => {
            const issue: CreateIssueDTO = {
              projectId: data.projectId,
              title: data.title,
              description: data.description,
              priorityId: data.priorityId,
              typeId: data.typeId,
              statusId: data.statusId,
              assigneeId: data.assigneeUser?.id || 0,
              tags: data.tags ?? [],
            };

            const success = await onFormSubmit(issue);
            if (success) {
              form.reset(); // Only reset after successful confirmation and submit
            }
          }
        );
      },
      [existingIssue, onFormSubmit, confirmDialog, form]
    );

    const discardDialog = useDiscardDialog();

    const handleCancelClick = useCallback(
      async (e?: MouseEvent<HTMLButtonElement>) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        if (!isDirty) {
          onCancel();
          return;
        }

        const shouldDiscard = await discardDialog.confirmDiscard();
        if (shouldDiscard) onCancel();
      },
      [isDirty, onCancel, discardDialog]
    );

    useImperativeHandle(ref, () => ({
      triggerCancel: handleCancelClick,
    }));

    useEffect(() => {
      if (existingIssue) {
        form.reset({
          projectId: existingIssue.projectId ?? projectId,
          title: existingIssue.title ?? '',
          description: existingIssue.description ?? '',
          priorityId: existingIssue.priorityId ?? 0,
          typeId: existingIssue.typeId ?? 0,
          statusId: existingIssue.statusId ?? 0,
          confirmSubmission: false,
          assigneeUser: existingIssue.assigneeUser
            ? {
                id: Number(existingIssue.assigneeUser.id),
                name:
                  existingIssue.assigneeUser.username ||
                  existingIssue.assigneeUser.email ||
                  'Unknown',
              }
            : undefined,
          tags:
            existingIssue.tags?.map((t) => ({
              id: t.id,
              name: t.name,
            })) ?? [],
        });
      } else {
        form.reset({
          title: '',
          description: '',
          projectId: projectId,
          priorityId: 0,
          typeId: 0,
          statusId: 0,
          confirmSubmission: false,
          assigneeUser: undefined,
          tags: [],
        });
      }
    }, [existingIssue, form, projectId]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Loading form data...</div>
        </div>
      );
    }

    return (
      <>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleFormSubmit)}>
          <IssueFormInput
            register={register}
            control={control}
            errors={errors}
            watch={watch}
            isDisabled={isSubmitting}
            dropdownValues={dropdownValues}
            projectId={projectId}
          />

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleCancelClick}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : existingIssue ? 'Update Issue' : 'Create Issue'}
            </Button>
          </div>
        </form>

        {confirmDialog.isOpen && (
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            isLoading={confirmDialog.isLoading}
            title={confirmDialog.config.title}
            message={confirmDialog.config.message}
            confirmText={confirmDialog.config.confirmText}
            cancelText={confirmDialog.config.cancelText}
            variant={confirmDialog.config.variant}
            onConfirm={confirmDialog.handleConfirm}
            onCancel={confirmDialog.handleCancel}
          />
        )}

        {discardDialog.isOpen && (
          <DiscardDialog
            isOpen={discardDialog.isOpen}
            onDiscard={discardDialog.handleDiscard}
            onCancel={discardDialog.handleCancel}
          />
        )}
      </>
    );
  }
);

IssueForm.displayName = 'IssueForm';
export default IssueForm;
