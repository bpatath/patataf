import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { StaticRouterContext } from "react-router";
import { Context, Next } from "koa";

import App from "./components/App";
import createStore, { CreateReduxOptions } from "./services/redux";
import createApollo, { CreateApolloOptions } from "./services/apollo";
import html from "~/html";

import { Config } from "./config";

type FrontendMiddleware = (ctx: Context, next: Next) => Promise<void>;

export default function addFrontendMiddleware(
  config: Config
): FrontendMiddleware {
  const reduxOpts: CreateReduxOptions = {
    ...config.redux,
    ssr: config.ssr,
    ssrRole: "server",
  };
  const apolloOpts: CreateApolloOptions = {
    ...config.apollo,
    ssr: config.ssr,
    ssrRole: "server",
  };

  return async (ctx, next) => {
    const store = createStore(reduxOpts);
    const client = createApollo(apolloOpts);

    const routerContext: StaticRouterContext = {};
    const rootHtml = renderToString(
      <StaticRouter location={ctx.url} context={routerContext}>
        <App
          store={store}
          client={client}
          config={config}
          theme={config.theme}
          MainComponent={config.app}
        />
      </StaticRouter>
    );

    if (routerContext.url) {
      ctx.redirect(routerContext.url);
      return;
    }

    ctx.body = html({
      ...config.html,
      rootHtml,
    });
    await next();
  };
}
