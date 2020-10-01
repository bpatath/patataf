import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { StaticRouterContext } from "react-router";
import { Middleware } from "koa";

import { createReduxStoreSSR } from "./redux";
import { createApolloClientSSR } from "./apollo";

import { Config, SSROptions } from "~/config";
import html from "~/html";
import App from "~/components/App";

export default function getServerMiddleware(
  config: Config,
  ssr: SSROptions
): Middleware {
  return async (ctx, next) => {
    const store = createReduxStoreSSR(config.redux);
    const client = createApolloClientSSR(ssr.schema);

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
