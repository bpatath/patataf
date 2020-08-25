import { Dispatch } from "redux";
import { State } from "~/services/redux";

export const API_PROGRESS_NEW = "API_PROGRESS_NEW";
export const API_PROGRESS_TIMEOUT_STEP = "API_PROGRESS_TIMEOUT_STEP";
export const API_PROGRESS_PROGRESS = "API_PROGRESS_PROGRESS";
export const API_PROGRESS_ERROR = "API_PROGRESS_ERROR";

type GetState = () => State;

export type APIProgressTimeoutStepAction = {
  type: typeof API_PROGRESS_TIMEOUT_STEP;
};
function progressTimeoutDispatcher(
  dispatch: Dispatch,
  getState: GetState
): void {
  if (getState().progress.progress < 40) {
    setTimeout(() => progressTimeoutDispatcher(dispatch, getState), 500);
    dispatch({
      type: API_PROGRESS_TIMEOUT_STEP,
    });
  }
}

export type APIProgressNewAction = {
  type: typeof API_PROGRESS_NEW;
};
export function APIRequestNew() {
  return (dispatch: Dispatch, getState: GetState): void => {
    setTimeout(() => progressTimeoutDispatcher(dispatch, getState), 500);
    dispatch({
      type: API_PROGRESS_NEW,
    });
  };
}

export type APIProgressStepAction = {
  type: typeof API_PROGRESS_PROGRESS;
  current: number;
  total: number;
};
export function APIProgress(
  current: number,
  total: number
): APIProgressStepAction {
  return {
    type: API_PROGRESS_PROGRESS,
    current,
    total,
  };
}

export type APIProgressErrorAction = {
  type: typeof API_PROGRESS_ERROR;
};
export function APIRequestError(): APIProgressErrorAction {
  return {
    type: API_PROGRESS_ERROR,
  };
}

export type APIProgressAction =
  | APIProgressTimeoutStepAction
  | APIProgressNewAction
  | APIProgressStepAction
  | APIProgressErrorAction;
