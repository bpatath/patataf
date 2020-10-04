import fs from "fs";
import { Logger } from "winston";
import { RootConfig, ConfigError } from "~/config";
import { Sequelize, SequelizeOptions, ModelCtor } from "sequelize-typescript";

interface SSLOptions {
  ca?: string | Buffer;
  cert?: string | Buffer;
  key?: string | Buffer;
  dhparam?: string | Buffer;
  minVersion?: string;
  maxVersion?: string;
  ciphers?: string;
  rejectUnauthorized?: boolean;
}

const dialects = ["sqlite", "mysql", "mariadb", "postgres", "mssql"];

export function createDatabase({
  rootConfig,
  logger,
  models,
}: {
  rootConfig: RootConfig;
  logger: Logger;
  models: ModelCtor[];
}): Sequelize {
  if (!dialects.includes(rootConfig.db_dialect)) {
    throw new ConfigError(rootConfig, "db_dialect", "Invalid dialect");
  }

  const sequelizeOptions: SequelizeOptions = {
    dialect: rootConfig["db_dialect"],
    host: rootConfig["db_unix_socket"] || rootConfig["db_host"],
    port: rootConfig["db_port"],
    username: rootConfig["db_user"],
    password: rootConfig["db_password"],
    database: rootConfig["db_database"],
    logging: logger.debug.bind(logger),
  };

  const sslOptions: SSLOptions = {
    minVersion: rootConfig["db_ssl_min_version"],
    maxVersion: rootConfig["db_ssl_max_version"],
    ciphers: rootConfig["db_ssl_ciphers"],
    rejectUnauthorized: rootConfig["db_ssl_verify_server_cert"] === false,
  };
  if (rootConfig["db_ssl_ca"]) {
    sslOptions.ca = fs.readFileSync(rootConfig["db_ssl_ca"]);
  }
  if (rootConfig["db_ssl_cert"]) {
    sslOptions.cert = fs.readFileSync(rootConfig["db_ssl_cert"]);
  }
  if (rootConfig["db_ssl_key"]) {
    sslOptions.key = fs.readFileSync(rootConfig["db_ssl_key"]);
  }
  if (rootConfig["db_ssl_dhparam"]) {
    sslOptions.dhparam = fs.readFileSync(rootConfig["db_ssl_dhparam"]);
  }

  switch (rootConfig["db_dialect"]) {
    case "sqlite":
      sequelizeOptions.storage = rootConfig["sqlite_storage"];
      break;

    case "mariadb":
    case "mysql":
      sequelizeOptions.dialectOptions = {
        socketPath: rootConfig["db_unix_socket"],
        ssl: sslOptions,
      };
      break;

    case "postgres":
      sequelizeOptions.dialectOptions = {
        ssl: sslOptions,
      };
      break;

    case "mssql":
      break;

    default:
      throw new ConfigError(
        rootConfig,
        "db_dialect",
        "Invalid database dialect."
      );
  }

  return new Sequelize({
    ...sequelizeOptions,
    models,
  });
}

// For use with sequelize-cli
//export const development = sequelizeOptions;
//export const production = sequelizeOptions;
