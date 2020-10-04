import Koa, { Middleware } from "koa";
import Router from "koa-tree-router";
import serve from "koa-static";
import { createContainer, AwilixContainer, asFunction, asValue } from "awilix";

import { Logger } from "winston";
import { loadRootConfig, RootConfig } from "./config";
import { createLogger } from "./logging";

type ObjConf = Record<string, unknown>;
type MiddlewareDI = (conf: ObjConf) => Middleware;

export default class Server {
  private readonly app: Koa;
  private readonly router: Router;
  private readonly container: AwilixContainer<{
    rootConfig: RootConfig;
    logger: Logger;
    app: Koa;
    backend: Middleware;
    backendConfig: ObjConf;
    router: Router;
    frontend: Middleware;
    frontendConfig: ObjConf;
  }>;

  constructor() {
    this.app = new Koa();
    this.container = createContainer();
    this.container.register({
      rootConfig: asFunction(loadRootConfig).singleton(),
      logger: asFunction(createLogger).singleton(),
      app: asValue(this.app),
    });
  }

  serve(path: string): void {
    this.app.use(serve(path));
  }

  useBackend(backend: MiddlewareDI, backendConfig: ObjConf): void {
    this.container.register({
      router: asValue(new Router()),
      backend: asFunction(backend),
      backendConfig: asValue(backendConfig),
    });
    this.app.use(this.container.cradle.backend);
    this.app.use(this.container.cradle.router.mount("/"));
  }

  useFrontend(frontend: MiddlewareDI, frontendConfig: ObjConf): void {
    this.container.register({
      frontend: asFunction(frontend),
      frontendConfig: asValue(frontendConfig),
    });
    this.app.use(this.container.cradle.frontend);
  }

  start(): void {
    const config = this.container.cradle.rootConfig;
    const logger = this.container.cradle.logger;
    this.app.listen(config.server_port, config.server_bind, () => {
      logger.info(
        "Server started at %s:%d",
        config.server_bind,
        config.server_port
      );
    });
  }
}
