import React, { ComponentType, ReactElement } from "react";
import { Route } from "react-router-dom";

import { useSelector } from "react-redux";
import { State } from "~/services/redux";
import { AuthState } from "~/reducers/auth";

import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";

type Props = {
  component: ComponentType;
  path: string;
  exact?: boolean;
};

export default function PrivateRoute(props: Props): ReactElement {
  const auth = useSelector<State, AuthState>((state) => state.auth);

  const Component = !auth.valid
    ? LandingPage
    : !auth.authenticated
    ? LoginPage
    : props.component;

  return <Route path={props.path} exact={props.exact} component={Component} />;
}
