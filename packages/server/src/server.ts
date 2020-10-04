import Koa from "koa";
import Router from "koa-tree-router";
import compose from "koa-compose";
import {
  createContainer,
  AwilixContainer,
  asFunction,
  asClass,
  asValue,
} from "awilix";

import { Logger } from "winston";
import { loadRootConfig, RootConfig } from "./config";
import { createLogger } from "./logging";

type ObjConf = Record<string, unknown>;

export default class Server {
  private readonly app: Koa;
  private readonly router: Router;
  private readonly container: AwilixContainer<{
    rootConfig: RootConfig;
    logger: Logger;
    backend: any;
    backendConfig: ObjConf;
    frontend: any;
    frontendConfig: ObjConf;
    app: Koa;
    router: Router;
  }>;

  constructor() {
    this.app = new Koa();
    this.router = new Router();
    this.container = createContainer();
    this.container.register({
      rootConfig: asFunction(loadRootConfig).singleton(),
      logger: asFunction(createLogger).singleton(),
      app: asValue(this.app),
      router: asValue(this.router),
    });
  }

  setBackend(backend: unknown, backendConfig: ObjConf): void {
    this.container.register({
      backend: asClass(backend),
      backendConfig: asValue(backendConfig),
    });
  }

  setFrontend(frontend: unknown, frontendConfig: ObjConf): void {
    this.container.register({
      frontend: asFunction(frontend),
      frontendConfig: asValue(frontendConfig),
    });
  }

  start(): void {
    const config = this.container.cradle.rootConfig;
    const logger = this.container.cradle.logger;
    const backend = this.container.cradle.backend;
    //const frontend = this.container.cradle.frontend;

    if (backend) {
      this.app.use(backend.getMiddleware());
    }

    this.app.use(this.router.mount("/"));

    this.app.listen(config.server_port, config.server_bind, () => {
      logger.info(
        "Server started at %s:%d",
        config.server_bind,
        config.server_port
      );
    });
  }
}
