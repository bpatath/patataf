import { GraphQLSchema } from "graphql";
import { UserBase } from "~/models/user";
import { SessionBase } from "~/models/session";

export interface Models {
  User: typeof UserBase;
  Session: typeof SessionBase;
}

export interface BackendConfig {
  schema: GraphQLSchema;
  models: Models;
}

export interface RootConfig {
  db_dialect: "sqlite" | "mysql" | "mariadb" | "postgres" | "mssql";
  db_host: string;
  db_port: number;
  db_unix_socket: string;
  db_user: string;
  db_database: string;
  db_password: string;
  sqlite_storage: string;
  db_ssl_ca: string;
  db_ssl_cert: string;
  db_ssl_key: string;
  db_ssl_dhparam: string;
  db_ssl_ciphers: string;
  db_ssl_min_version: string;
  db_ssl_max_version: string;
  db_ssl_verify_server_cert: boolean;
  auth_method: string;
  auth_remote_enabled: boolean;
  auth_remote_proxies: string;
  auth_remote_header: string;
  auth_frontend_url: string;
}

export class ConfigError extends Error {
  constructor(rootConfig: RootConfig, key: keyof RootConfig, message: string) {
    super(
      `Configuration error in key ${key} '${String(
        rootConfig[key]
      )}': ${message}`
    );
  }
}
