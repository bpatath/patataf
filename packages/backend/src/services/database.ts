import env, { ConfigError } from "./env";
import logging from "./logging";
import fs from "fs";
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

if (
  !["sqlite", "mysql", "mariadb", "postgres", "mssql"].includes(
    env["db_dialect"]
  )
) {
  throw new ConfigError("db_dialect", "Invalid dialect");
}

const sequelizeOptions: SequelizeOptions = {
  dialect: env["db_dialect"],
  host: env["db_unix_socket"] || env["db_host"],
  port: env["db_port"],
  username: env["db_user"],
  password: env["db_password"],
  database: env["db_database"],
  logging: logging.debug.bind(logging),
};

const sslOptions: SSLOptions = {
  minVersion: env["db_ssl_min_version"],
  maxVersion: env["db_ssl_max_version"],
  ciphers: env["db_ssl_ciphers"],
  rejectUnauthorized: env["db_ssl_verify_server_cert"] === false,
};
if (env["db_ssl_ca"]) {
  sslOptions.ca = fs.readFileSync(env["db_ssl_ca"]);
}
if (env["db_ssl_cert"]) {
  sslOptions.cert = fs.readFileSync(env["db_ssl_cert"]);
}
if (env["db_ssl_key"]) {
  sslOptions.key = fs.readFileSync(env["db_ssl_key"]);
}
if (env["db_ssl_dhparam"]) {
  sslOptions.dhparam = fs.readFileSync(env["db_ssl_dhparam"]);
}

switch (env["db_dialect"]) {
  case "sqlite":
    sequelizeOptions.storage = env["sqlite_storage"];
    break;

  case "mariadb":
  case "mysql":
    sequelizeOptions.dialectOptions = {
      socketPath: env["db_unix_socket"],
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
    throw new ConfigError("db_dialect", "Invalid database dialect.");
}

export default (models: ModelCtor[]): Sequelize =>
  new Sequelize({
    ...sequelizeOptions,
    models,
  });

// For use with sequelize-cli
export const development = sequelizeOptions;
export const production = sequelizeOptions;
