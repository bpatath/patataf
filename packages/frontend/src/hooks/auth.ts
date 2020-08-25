import { useState } from "react";
import { useDispatch } from "react-redux";
import { authResult } from "~/actions/auth";

export enum AuthError {
  NONE,
  INVALID_CREDENTIALS,
  SERVER,
  NETWORK,
}

type Login = (username: string, password: string) => void;
export function useLogin(): [Login, AuthError] {
  const [error, setError] = useState<AuthError>(AuthError.NONE);
  const dispatch = useDispatch();
  const login = (username: string, password: string) => {
    fetch(process.env.REACT_APP_BACKEND_URI + "/auth/local/login", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ username, password }),
    })
      .then((resp) => {
        if (resp.ok) {
          setError(AuthError.NONE);
          dispatch(authResult(true));
        } else if (resp.status == 401) {
          setError(AuthError.INVALID_CREDENTIALS);
          dispatch(authResult(false));
        } else {
          setError(AuthError.SERVER);
          dispatch(authResult(false));
        }
      })
      .catch(() => {
        setError(AuthError.NETWORK);
        dispatch(authResult(false));
      });
  };
  return [login, error];
}

type Logout = () => void;
export function useLogout(): [Logout, AuthError] {
  const [error, setError] = useState<AuthError>(AuthError.NONE);
  const dispatch = useDispatch();
  const logout = () => {
    fetch(process.env.REACT_APP_BACKEND_URI + "/auth/local/logout", {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "post",
    })
      .then((resp) => {
        if (resp.ok) {
          setError(AuthError.NONE);
          dispatch(authResult(false));
        } else {
          setError(AuthError.SERVER);
        }
      })
      .catch(() => {
        setError(AuthError.NETWORK);
      });
  };
  return [logout, error];
}
