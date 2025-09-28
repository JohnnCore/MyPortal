export const ROOT = "/"
export const BOARD = "/board"
export const ISSUE_DETAILS = `${BOARD}/issue/:id`
export const TEST_MODAL = "/test";

export const modalPaths: Record<string, string> = {
    [ISSUE_DETAILS]: BOARD,
    [TEST_MODAL]: ROOT,
};