import { Action } from "~/actions/action";
import { AUTH_RESULT } from "~/actions/auth";

const initialState = {
  valid: false,
  authenticated: null,
};
export type AuthState = typeof initialState;

export default (state: AuthState = initialState, action: Action): AuthState => {
  switch (action.type) {
    case AUTH_RESULT:
      return Object.assign({}, state, {
        valid: true,
        authenticated: action.authenticated,
      });

    default:
      return state;
  }
};
