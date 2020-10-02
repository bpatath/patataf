import { RootConfig, ConfigError } from "./config";
import winston, { Logger } from "winston";

export function createLogger({
  rootConfig,
}: {
  rootConfig: RootConfig;
}): Logger {
  let format;
  switch (rootConfig.logging_format) {
    case "raw":
      format = winston.format.combine(
        winston.format.splat(),
        winston.format.simple()
      );
      break;

    case "json":
      format = winston.format.json();
      break;

    default:
      throw new ConfigError(
        rootConfig,
        "logging_format",
        "Invalid logging format"
      );
  }

  let transport;
  switch (rootConfig.logging_mode) {
    case "console":
      transport = new winston.transports.Console({
        format,
      });
      break;

    case "file":
      transport = new winston.transports.File({
        filename: rootConfig.logging_file_path,
        format,
      });
      break;

    default:
      throw new ConfigError(rootConfig, "logging_mode", "Invalid logging mode");
  }

  return winston.createLogger({
    level: rootConfig.logging_level,
    transports: [transport],
  });
}
