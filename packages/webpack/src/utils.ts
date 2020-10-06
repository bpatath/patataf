import path from "path";
import webpack from "webpack";
import requireFromString from "require-from-string";
import { IFs } from "memfs";

import paths from "~/config/paths";

export function logStats(
  compiler: webpack.Compiler,
  logger: webpack.Logger,
  stats: webpack.Stats
): void {
  const statsString = stats.toString(compiler.options.stats);
  if (statsString.length) {
    if (stats.hasErrors()) {
      logger.error(statsString);
    } else if (stats.hasWarnings()) {
      logger.warn(statsString);
    } else {
      logger.info(statsString);
    }
  }
  if (stats.hasErrors()) {
    logger.info("Compilation failed.");
  } else if (stats.hasWarnings()) {
    logger.info("Compilation succeeded with warnings.");
  } else {
    logger.info("Compilation succeeded.");
  }
}

/* Typesafe filter to exclude falsy values from array.
 * E.g. [plugin1, isDev && plugin2].filter(excludeFalse);
 */
export function excludeFalse<T>(v: T | false): v is T {
  return !!v;
}

/* Import a file outputed by webpack.
 * Inspired by https://valerybugakov.com/hot-reloading-react-ssr/
 */
export function importWebpackOutput(fs: IFs, stats: webpack.Stats): any {
  const mainPath = stats.toJson().assetsByChunkName?.main;
  if (!mainPath || !mainPath[0]) {
    throw new Error("Internal error. Missing main chunk is stats.");
  }

  const filename = path.join(paths.devServerOutput, mainPath[0]);
  const buffer = fs.readFileSync(filename);
  const mod = requireFromString(
    buffer.toString(),
    path.join(__dirname, filename) // Needed for the require stack to work
  );
  return mod;
}
