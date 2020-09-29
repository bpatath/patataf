import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import createStore from "./redux";
import createApollo from "./apollo";

import { Config } from "~/config";
import App from "~/components/App";

export function renderClient(config: Config, ssr?: boolean): void {
  const store = createStore({
    ...config.redux,
    ssrRole: "client",
    ssr,
  });
  const client = createApollo({
    ...config.apollo,
    ssrRole: "client",
    ssr,
  });

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

  if (ssr) {
    ReactDOM.hydrate(element, container);
  } else {
    ReactDOM.render(element, container);
  }
}
