import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { StaticRouterContext } from "react-router";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { Middleware } from "koa";

import { createReduxStoreSSR } from "./redux";
import { createApolloClientSSR } from "./apollo";

import { Config } from "~/config";
import { GraphQLSchema } from "graphql";
import html from "~/html";
import App from "~/components/App";

interface RootConfig {
  public_path: string;
}
interface BackendConfig {
  schema: GraphQLSchema;
}

export function getFrontendSSRMiddleware({
  rootConfig,
  frontendConfig,
  backendConfig,
  logger,
}: {
  rootConfig: RootConfig;
  frontendConfig: Config;
  backendConfig: BackendConfig;
  logger: Logger;
}): Middleware {
  return async (ctx, next) => {
    const styleSheet = new ServerStyleSheet();
    try {
      const store = createReduxStoreSSR(frontendConfig.redux);
      const client = createApolloClientSSR(backendConfig.schema);

      const routerContext: StaticRouterContext = {};
      const rootHtml = renderToString(
        <StaticRouter location={ctx.url} context={routerContext}>
          <StyleSheetManager sheet={styleSheet.instance}>
            <App
              store={store}
              client={client}
              config={frontendConfig}
              theme={frontendConfig.theme}
              MainComponent={frontendConfig.app}
            />
          </StyleSheetManager>
        </StaticRouter>
      );

      if (routerContext.url) {
        ctx.redirect(routerContext.url);
        return;
      }

      ctx.body = html({
        ...frontendConfig.html,
        publicPath: rootConfig.public_path,
        rootHtml,
        styleTags: styleSheet.getStyleTags(),
      });
    } catch (err) {
      if (err instanceof URIError) {
        ctx.statusCode = 400;
      } else {
        logger.error(err);
        ctx.statusCode = 500;
      }
    } finally {
      styleSheet.seal();
    }
    await next();
  };
}
