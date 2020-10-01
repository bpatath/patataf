import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { createReduxStore } from "./redux";
import { createApolloClient } from "./apollo";

import { Config } from "~/config";
import App from "~/components/App";

export function renderClient(config: Config): void {
  const store = createReduxStore(config.redux);
  const client = createApolloClient();

  const container = document.getElementById("root");
  const element = (
    <BrowserRouter>
      <App
        store={store}
        client={client}
        config={config}
        theme={config.theme}
        MainComponent={config.app}
      />
    </BrowserRouter>
  );

  if (process.env.SSR) {
    ReactDOM.hydrate(element, container);
  } else {
    ReactDOM.render(element, container);
  }
}
