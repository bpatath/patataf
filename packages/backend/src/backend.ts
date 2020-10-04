import Koa, { Middleware } from "koa";
import Router from "koa-tree-router";
import compose from "koa-compose";
import { createContainer, asValue, asFunction } from "awilix";
import { Logger } from "winston";

import { RootConfig, BackendConfig } from "./config";
import { createDatabase } from "./services/database";

import { getSessionMiddleware } from "./services/sessions";
import { getAuthenticationMiddleware } from "./services/auth";
import { getLocalAuthMiddleware } from "./services/auth/local";
import { getRemoteAuthMiddleware } from "./services/auth/remote";
import { getApolloMiddleware } from "./services/apollo";

export function getBackendMiddleware({
  rootConfig,
  backendConfig,
  logger,
  router,
  app,
}: {
  rootConfig: RootConfig;
  backendConfig: BackendConfig;
  logger: Logger;
  router: Router;
  app: Koa;
}): Middleware {
  const container = createContainer();
  container.register({
    rootConfig: asValue(rootConfig),
    logger: asValue(logger),
    router: asValue(router),
    app: asValue(app),
    schema: asValue(backendConfig.schema),
    models: asValue(backendConfig.models),
    database: asFunction(createDatabase).singleton(),
  });

  const middlewares: Middleware[] = [];

  middlewares.push(container.build(getSessionMiddleware));
  middlewares.push(container.build(getAuthenticationMiddleware));
  if (rootConfig["auth_remote_enabled"]) {
    middlewares.push(container.build(getRemoteAuthMiddleware));
  }
  middlewares.push(container.build(getApolloMiddleware));

  container.build(getLocalAuthMiddleware);
  return compose(middlewares);
}
