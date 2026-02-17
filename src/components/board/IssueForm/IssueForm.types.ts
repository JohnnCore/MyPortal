import { CreateIssueDTO } from '../../../types';
import type { IssueResponse } from '../../../types/domain/issue';
import type { FormRef } from '../../../types/ui';

export interface IssueFormData extends CreateIssueDTO {
  confirmSubmission: boolean;
}

export interface IssueFormProps {
  existingIssue: IssueResponse | null;
  projectId?: number;
  onFormSubmit: (values: CreateIssueDTO) => Promise<boolean>;
  onCancel: () => void;
}

// IssueFormRef extends FormRef with same interface
export type IssueFormRef = FormRef;
