import path from "path";
import Koa, { Middleware } from "koa";
import webpack, { Logger } from "webpack";
import koaWebpack from "koa-webpack";
import { createFsFromVolume, Volume, IFs } from "memfs";
import requireFromString from "require-from-string";

import paths from "./config/paths";
import clientConfig from "./config/client";
import devServerConfig from "./config/dev-server";

class BackendDevMiddleware {
  app: Koa;
  compiler: webpack.Compiler;
  fs: IFs;
  middleware?: Middleware;
  callbacks: ((middleware: Middleware) => void)[];
  logger: Logger;

  constructor(app: Koa) {
    this.app = app;
    this.compiler = webpack(devServerConfig);
    this.logger = this.compiler.getInfrastructureLogger("sdm");
    this.fs = createFsFromVolume(new Volume());
    this.callbacks = [];

    this.compiler.outputFileSystem = Object.assign(this.fs, {
      join: path.join.bind(path),
    });
    this.setHooks();

    this.compiler.watch({}, (error) => {
      if (error) {
        this.logger.error(error);
      }
    });
  }

  /* Setup compiler hooks responsible of updating
   * the backend middleware on changes */
  setHooks() {
    const invalid = () => {
      if (this.middleware) {
        this.middleware = undefined;
        this.logger.info("Compiling backend...");
      }
    };

    const done = (stats: webpack.Stats) => {
      this.logStats(stats);
      if (stats.hasErrors() || stats.hasWarnings()) {
        return;
      }
      const backend = this.importBackendFromOutput(stats);
      this.setBackendMiddleware(backend.getMiddleware(this.app));
    };
    this.compiler.hooks.watchRun.tap("BackendDevMiddleware", invalid);
    this.compiler.hooks.invalid.tap("BackendDevMiddleware", invalid);
    this.compiler.hooks.done.tap("BackendDevMiddleware", done);
  }

  /* Import a new backend server from webpack output,
   * and delete the previous server to free memory.
   * Inspired by https://valerybugakov.com/hot-reloading-react-ssr/
   */
  importBackendFromOutput(stats: webpack.Stats) {
    const serverPath = stats.toJson().assetsByChunkName?.main;
    if (!serverPath || !serverPath[0]) {
      throw new Error("Internal error. Missing main chunk is stats.");
    }

    const filename = path.join(paths.devServerOutput, serverPath[0]);
    const serverBuffer = this.fs.readFileSync(filename);
    const server = requireFromString(
      serverBuffer.toString(),
      path.join(__dirname, filename) // Needed for the require stack to work
    ).default;
    return server;
  }

  /* Set a new backend middleware after recompilation */
  setBackendMiddleware(middleware: Middleware): void {
    const callbacks = this.callbacks;
    this.middleware = middleware;
    this.callbacks = [];
    callbacks.forEach((callback) => {
      callback(middleware);
    });
  }

  /* Get the backend middleware. If necessary, will wait until recompilation is done before
   * returning a valid middleware.
   */
  async getBackendMiddleware(): Promise<Middleware> {
    if (this.middleware) {
      return this.middleware;
    } else {
      return new Promise((resolve) => {
        this.callbacks.push((middleware) => resolve(middleware));
      });
    }
  }

  /* Return a proxy middleware that will forward all requests to
   * the backend middleware.
   */
  getProxyMiddleware(): Middleware {
    return async (ctx, next) => {
      const backendMiddleware = await this.getBackendMiddleware();
      await backendMiddleware(ctx, next);
    };
  }

  logStats(stats: webpack.Stats) {
    const statsString = stats.toString(this.compiler.options.stats);
    if (statsString.length) {
      if (stats.hasErrors()) {
        this.logger.error(statsString);
      } else if (stats.hasWarnings()) {
        this.logger.warn(statsString);
      } else {
        this.logger.info(statsString);
      }
    }
    if (stats.hasErrors()) {
      this.logger.info("Backend compilation failed.");
    } else if (stats.hasWarnings()) {
      this.logger.info("Backend compilation succeeded with warnings.");
    } else {
      this.logger.info("Backend compilation succeeded.");
    }
  }
}

async function createBackendMiddleware(app: Koa): Promise<Middleware> {
  const bdw = new BackendDevMiddleware(app);
  await bdw.getBackendMiddleware();
  return bdw.getProxyMiddleware();
}

/* The client middleware is just composed of
 * - webpack-dev-middleware
 * - webpack-hot-middleware
 * Nicely packed into one koa middleware in koa-webpack
 */
async function createClientMiddleware(): Promise<Middleware> {
  const compiler = webpack(clientConfig);
  return await koaWebpack({
    compiler,
    devMiddleware: {
      publicPath: paths.publicPath,
    },
  });
}

export default async function start(): Promise<void> {
  const app = new Koa();
  app.use(await createClientMiddleware());
  app.use(await createBackendMiddleware(app));
  app.listen(8080, () => {
    console.log("Server started on port 8080");
  });
}
