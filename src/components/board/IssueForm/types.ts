import { FormErrors } from "../../../hooks/useForm";
import { IssueStatus, IssueType, Priority } from "../../../types/board";

export interface IssueFormValues {
    title: string;
    assignee: string;
    dueDate: string;
    tags: string[];
    confirmSubmission: boolean;
    description: string;
    type: IssueType;
    status: IssueStatus;
    priority: Priority;
}

export interface IssueData extends Omit<IssueFormValues, 'confirmSubmission'> {
    id: string;
    status: IssueStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ImperativeFormHandle {
    handleReset: () => void;
    handleSubmit: () => Promise<{ isValid: boolean; errors: FormErrors<IssueFormValues> }>;
    values: IssueFormValues;
}