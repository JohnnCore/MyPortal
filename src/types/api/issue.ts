import { CommentWithUser, IssueWithRelations } from '../domain';

export type GetIssueResponse = {
  data: IssueWithRelations;
};

export type CreateCommentResponse = {
  status: string;
  data: CommentWithUser;
  message: string;
};

export type CreateIssueResponse = {
  status: string;
  data: IssueWithRelations;
  message: string;
};

export type UpdateIssueResponse = {
  status: string;
  data: IssueWithRelations;
  message: string;
};

export type DeleteIssueResponse = {
  status: string;
  message: string;
};

export type ReorderIssueResponse = {
  status: string;
  message: string;
};
