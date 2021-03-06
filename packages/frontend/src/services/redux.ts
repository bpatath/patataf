import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  Middleware,
  Store,
} from "redux";
import progress, { APIProgressState } from "~/reducers/progress";
import auth, { AuthState } from "~/reducers/auth";

export interface State {
  auth: AuthState;
  progress: APIProgressState;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: null;
    __REDUX_STATE__: State | null;
  }
}

const composeEnhancers =
  process.env.NODE_ENV == "development"
    ? (typeof window !== "undefined" &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
      compose
    : compose;

const thunkMiddleware: Middleware = ({ dispatch, getState }) => (next) => (
  action
) => {
  if (typeof action === "function") {
    return action(dispatch, getState);
  }
  return next(action);
};

export type ReduxOptions = {
  reducers?: Record<string, unknown>;
};

export function createReduxStore(options?: ReduxOptions): Store {
  const rootReducer = combineReducers({
    ...options?.reducers,
    progress,
    auth,
  });

  let preloadedState = undefined;
  if (process.env.SSR && window && window.__REDUX_STATE__) {
    preloadedState = window.__REDUX_STATE__;
    delete window.__REDUX_STATE__;
  }

  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(thunkMiddleware))
  );
}

export function createReduxStoreSSR(options?: ReduxOptions): Store {
  const rootReducer = combineReducers({
    ...options?.reducers,
    progress,
    auth,
  });

  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunkMiddleware))
  );
}
