import webpack from "webpack";

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
    logger.info("Backend compilation failed.");
  } else if (stats.hasWarnings()) {
    logger.info("Backend compilation succeeded with warnings.");
  } else {
    logger.info("Backend compilation succeeded.");
  }
}

export function excludeFalse<T>(v: T | false): v is T {
  return !!v;
}
