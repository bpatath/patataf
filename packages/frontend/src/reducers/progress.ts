import { Action } from "~/actions/action";
import {
  API_PROGRESS_NEW,
  API_PROGRESS_TIMEOUT_STEP,
  API_PROGRESS_PROGRESS,
  API_PROGRESS_ERROR,
} from "~/actions/progress";

const initialState = {
  progress: 100,
  error: false,
};
export type APIProgressState = typeof initialState;

export default (
  state: APIProgressState = initialState,
  action: Action
): APIProgressState => {
  switch (action.type) {
    case API_PROGRESS_NEW:
      return Object.assign({}, state, { progress: 0, error: false });

    case API_PROGRESS_TIMEOUT_STEP:
      return Object.assign({}, state, {
        progress: state.progress + (40 - state.progress) / 4,
      });

    case API_PROGRESS_PROGRESS:
      const progress = 40 + (60 * action.current) / action.total;
      return Object.assign({}, state, { progress });

    case API_PROGRESS_ERROR:
      return Object.assign({}, state, { error: true });

    default:
      return state;
  }
};
