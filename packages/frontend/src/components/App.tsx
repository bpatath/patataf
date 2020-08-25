import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import { Store } from "redux";
import {
  ApolloProvider,
  ApolloClient,
  NormalizedCacheObject,
} from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { Theme } from "@patataf/ui";

import { Config } from "~/config";
export const ConfigContext = React.createContext<Config | null>(null);

type Props = {
  store: Store;
  client: ApolloClient<NormalizedCacheObject>;
  config: Config;
  theme: Theme;
  MainComponent: React.ComponentType;
};

export default function PoafApp({
  store,
  client,
  config,
  theme,
  MainComponent,
}: Props): ReactElement {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <ConfigContext.Provider value={config}>
            <ThemeProvider theme={theme}>
              <MainComponent />
            </ThemeProvider>
          </ConfigContext.Provider>
        </ApolloProvider>
      </Provider>
    </React.StrictMode>
  );
}
