import Koa, { Middleware } from "koa";
import compose from "koa-compose";
import { createContainer, AwilixContainer, asFunction } from "awilix";

import { Logger } from "winston";
import { loadRootConfig, RootConfig } from "./config";
import { createLogger } from "./logging";

export default class Server {
  readonly container: AwilixContainer<{
    rootConfig: RootConfig;
    logger: Logger;
    backend: any;
    frontend: any;
  }>;

  constructor() {
    this.container = createContainer();
    this.container.register({
      rootConfig: asFunction(loadRootConfig).singleton(),
      logger: asFunction(createLogger).singleton(),
    });
  }

  setBackend(backend): void {
    this.container.register({
      backend: asFunction(backend),
    });
  }

  setFrontend(frontend): void {
    this.container.register({
      frontend: asFunction(frontend),
    });
  }

  start(): void {
    const app = new Koa();
    const config = this.container.cradle.rootConfig;
    const logger = this.container.cradle.logger;
    const backend = this.container.cradle.backend;
    //const frontend = this.container.cradle.frontend;

    if (backend) {
      app.use(backend.getMiddleware(app));
    }

    app.listen(config.server_port, config.server_bind, () => {
      logger.info(
        "Server started at %s:%d",
        config.server_bind,
        config.server_port
      );
    });
  }
}
