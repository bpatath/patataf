import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";

import createStore, { CreateReduxOptions } from "./services/redux";
import createApollo, { CreateApolloOptions } from "./services/apollo";

import { Config } from "./config";

export default function createFrontend(config: Config): void {
  const reduxOpts: CreateReduxOptions = {
    ...config.redux,
    ssr: config.ssr,
    ssrRole: "client",
  };
  const apolloOpts: CreateApolloOptions = {
    ...config.apollo,
    ssr: config.ssr,
    ssrRole: "client",
  };
  const store = createStore(reduxOpts);
  const client = createApollo(apolloOpts);

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

  if (config.ssr) {
    ReactDOM.hydrate(element, container);
  } else {
    ReactDOM.render(element, container);
  }
}
