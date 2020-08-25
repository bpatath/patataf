import env, { ConfigError } from "./env";
import winston from "winston";

let format;
switch (env["logging_format"]) {
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
    throw new ConfigError("logging_format", "Invalid logging format");
}

let transport;
switch (env["logging_mode"]) {
  case "console":
    transport = new winston.transports.Console({
      format,
    });
    break;

  case "file":
    transport = new winston.transports.File({
      filename: env["logging_file_path"],
      format,
    });
    break;

  default:
    throw new ConfigError("logging_mode", "Invalid logging mode");
}

export default winston.createLogger({
  level: env["logging_level"],
  transports: [transport],
});
