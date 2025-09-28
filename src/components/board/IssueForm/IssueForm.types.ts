import { Issue } from "../../../types/board";

export interface IssueFormData extends Issue {
    confirmSubmission: boolean;
}