export interface CreateProjectInviteResponse {
  status: string;
  data: {
    id: number;
    token: string;
    expiresAt: string;
    maxUses: number | null;
  };
}

export interface AcceptInviteResponse {
  status: string;
  message?: string;
  data?: { projectId: number };
}
