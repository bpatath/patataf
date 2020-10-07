import path from "path";
import webpack from "webpack";
import koaWebpack from "koa-webpack";
import { createFsFromVolume, Volume } from "memfs";
import { DevServer } from "@patataf/server";

import paths from "./config/paths";
import clientConfig from "./config/client";
import devServerConfig from "./config/dev-server";
import { logStats, importWebpackOutput } from "./utils";

async function addClientMiddleware(server: DevServer): Promise<void> {
  const compiler = webpack(clientConfig(true));
  server.use(
    await koaWebpack({
      compiler,
      devMiddleware: {
        publicPath: paths.publicPath,
      },
      hotClient: {
        host: {
          client: "*",
          server: server.container.cradle.rootConfig.server_bind,
        },
      },
    })
  );
}

async function addServerMiddleware(server: DevServer): Promise<void> {
  const compiler = webpack(devServerConfig);
  const logger = compiler.getInfrastructureLogger("sdm");

  const fs = createFsFromVolume(new Volume());
  compiler.outputFileSystem = Object.assign(fs, {
    join: path.join.bind(path),
  });

  const backend = server.createIndex();
  const frontend = server.createIndex();

  const invalid = () => {
    server.invalidateEndMiddleware(backend);
    server.invalidateEndMiddleware(frontend);
    logger.info("Recompiling server...");
  };

  const done = (stats: webpack.Stats) => {
    logStats(compiler, logger, stats);
    if (stats.hasErrors() || stats.hasWarnings()) {
      return;
    }
    const m = importWebpackOutput(fs, stats);
    server.useBackend(m.backend, m.backendConfig, backend);
    server.useFrontend(m.frontend, m.frontendConfig, frontend);
  };
  compiler.hooks.watchRun.tap("BackendDevMiddleware", invalid);
  compiler.hooks.invalid.tap("BackendDevMiddleware", invalid);
  compiler.hooks.done.tap("BackendDevMiddleware", done);
  compiler.watch({}, (error) => {
    if (error) {
      logger.error(error);
    }
  });
}

export default async function start(): Promise<void> {
  const server = new DevServer();
  await addClientMiddleware(server);
  await addServerMiddleware(server);
  server.start();
}
