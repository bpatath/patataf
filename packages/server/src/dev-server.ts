import Koa, { Middleware } from "koa";
import Router from "koa-tree-router";
import compose from "koa-compose";
import { createContainer, AwilixContainer, asFunction, asValue } from "awilix";

import { Logger } from "winston";
import { loadRootConfig, RootConfig } from "./config";
import { createLogger } from "./logging";

type ObjConf = Record<string, unknown>;
type MiddlewareDI = (conf: ObjConf) => Middleware;
type MiddlewareConf = {
  m?: Middleware;
  cb: ((m: Middleware) => void)[];
};

export default class DevServer {
  private readonly app: Koa;
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

  private middlewares: MiddlewareConf[];

  constructor() {
    this.app = new Koa();
    this.middlewares = [];
    this.container = createContainer();
    this.container.register({
      rootConfig: asFunction(loadRootConfig).singleton(),
      logger: asFunction(createLogger).singleton(),
      app: asValue(this.app),
    });
  }

  use(middleware: Middleware): void {
    this.app.use(middleware);
  }

  /*
   * The server uses `getProxyMiddleware`. These proxy middlewares will wait
   * until a corresponding end middleware is available before forwading
   * the request. The end middleware is set after recompilation using
   * `setEndMiddleware` and retrieved by the proxy using `getEndMiddleware`.
   */

  private async getEndMiddleware(index: number): Promise<Middleware> {
    const middleware = this.middlewares[index].m;
    if (middleware) {
      return middleware;
    } else {
      return new Promise((resolve) => {
        this.middlewares[index].cb.push((m) => resolve(m));
      });
    }
  }

  private setEndMiddleware(index: number, middleware: Middleware): void {
    const callbacks = this.middlewares[index].cb;
    this.middlewares[index].m = middleware;
    this.middlewares[index].cb = [];
    callbacks.forEach((callback) => {
      callback(middleware);
    });
  }

  invalidateEndMiddleware(index: number): void {
    this.middlewares[index].m = undefined;
  }

  private getProxyMiddleware(index: number): Middleware {
    return async (ctx, next) => {
      const backendMiddleware = await this.getEndMiddleware(index);
      await backendMiddleware(ctx, next);
    };
  }

  private createIndex(index?: number): number {
    if (index === undefined) {
      index = this.middlewares.length;
      this.middlewares.push({ cb: [] });
      this.use(this.getProxyMiddleware(index));
    }
    return index;
  }

  useBackend(
    backend: MiddlewareDI,
    backendConfig: ObjConf,
    index?: number
  ): number {
    this.container.register({
      router: asValue(new Router()),
      backend: asFunction(backend),
      backendConfig: asValue(backendConfig),
    });
    index = this.createIndex(index);
    this.setEndMiddleware(
      index,
      compose([
        this.container.cradle.backend,
        this.container.cradle.router.mount("/"),
      ])
    );
    return index;
  }

  useFrontend(
    frontend: MiddlewareDI,
    frontendConfig: ObjConf,
    index?: number
  ): number {
    this.container.register({
      frontend: asFunction(frontend),
      frontendConfig: asValue(frontendConfig),
    });
    index = this.createIndex(index);
    this.setEndMiddleware(index, this.container.cradle.frontend);
    return index;
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
