import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { StaticRouterContext } from "react-router";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { Middleware } from "koa";

import { createReduxStoreSSR } from "./redux";
import { createApolloClientSSR } from "./apollo";

import { Config, SSROptions } from "~/config";
import html from "~/html";
import App from "~/components/App";

export function getSSRMiddleware(config: Config, ssr: SSROptions): Middleware {
  return async (ctx, next) => {
    const styleSheet = new ServerStyleSheet();
    try {
      const store = createReduxStoreSSR(config.redux);
      const client = createApolloClientSSR(ssr.schema);

      const routerContext: StaticRouterContext = {};
      const rootHtml = renderToString(
        <StaticRouter location={ctx.url} context={routerContext}>
          <StyleSheetManager sheet={styleSheet.instance}>
            <App
              store={store}
              client={client}
              config={config}
              theme={config.theme}
              MainComponent={config.app}
            />
          </StyleSheetManager>
        </StaticRouter>
      );

      if (routerContext.url) {
        ctx.redirect(routerContext.url);
        return;
      }

      ctx.body = html({
        ...config.html,
        rootHtml,
        styleTags: styleSheet.getStyleTags(),
      });
    } catch (err) {
      // TODO: log errors
      if (err instanceof URIError) {
        ctx.statusCode = 400;
      } else {
        ctx.statusCode = 500;
      }
    } finally {
      styleSheet.seal();
    }
    await next();
  };
}
