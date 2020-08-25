import React, { ReactElement, SyntheticEvent } from "react";
import { Layout, Form, Header } from "@patataf/ui";

import { useTextInput } from "~/hooks/input";
import { useLogin, AuthError } from "~/hooks/auth";

export default function LoginPage(): ReactElement {
  const [username, onUsernameChange] = useTextInput();
  const [password, onPasswordChange] = useTextInput();
  const [login, error] = useLogin();

  const onSubmit = (event: SyntheticEvent) => {
    login(username, password);
    event.preventDefault();
    event.stopPropagation();
  };

  if (error == AuthError.INVALID_CREDENTIALS) {
  }

  return (
    <Layout.CenteredPage>
      <Header>Connexion</Header>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label htmlFor="username">Username</Form.Label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={onUsernameChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={onPasswordChange}
          />
        </Form.Group>

        <input type="submit" value="Login" />
      </Form>
    </Layout.CenteredPage>
  );
}
