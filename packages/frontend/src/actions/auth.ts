export const AUTH_RESULT = "ACTION_AUTH_RESULT";

export type AuthResultAction = {
  type: typeof AUTH_RESULT;
  authenticated: boolean;
};

export function authResult(authenticated: boolean): AuthResultAction {
  return { type: AUTH_RESULT, authenticated };
}
