import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { StaticRouterContext } from "react-router";
import { Middleware } from "koa";

import createStore, { ReduxOptions } from "./redux";
import createApollo, { ApolloOptions } from "./apollo";

import { Config } from "~/config";
import html from "~/html";
import App from "~/components/App";

export default function getServerMiddleware(
  config: Config,
  ssr?: boolean
): Middleware {
  const reduxOpts: ReduxOptions = {
    ...config.redux,
    ssrRole: "server",
    ssr,
  };
  const apolloOpts: ApolloOptions = {
    ...config.apollo,
    ssrRole: "server",
    ssr,
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
