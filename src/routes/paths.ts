export const LOGIN = '/login';
export const REGISTER = '/register';

export const ROOT = '/';

export const BOARD = `/board/:projectId`;
export const ISSUE_DETAILS = `${BOARD}/issue/:id`;
export const INVITE_ACCEPT = '/invite/:token';

export const PROJECT_CREATE = '/project/create';

export const TEST_MODAL = '/test';

export const modalPaths: Record<string, string> = {
  [ISSUE_DETAILS]: BOARD,
  [TEST_MODAL]: ROOT,
};
