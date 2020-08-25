import fs from "fs";

type StringEnvMap = Record<string, string>;
function parse(data: string): StringEnvMap {
  const res: Record<string, string> = {};
  const lines = data.split(/\r?\n/);
  lines.forEach((line) => {
    const parts = line.split("=", 2);
    if (parts.length < 2) {
      return;
    }

    const key = parts[0].trim().toLowerCase();
    const value = parts[1].trim();
    res[key] = value;
  });
  return res;
}
function parseFile(filename: string): StringEnvMap {
  if (!fs.existsSync(filename)) {
    return {};
  } else {
    return parse(fs.readFileSync(filename, { encoding: "utf8" }));
  }
}

function resolve(
  key: string,
  envMap: StringEnvMap,
  defaultMap: StringEnvMap
): string {
  const envVal = process.env[key];
  if (envVal !== undefined) {
    return envVal;
  } else if (envMap[key] !== undefined) {
    return envMap[key];
  } else if (defaultMap[key] !== undefined) {
    return defaultMap[key];
  } else {
    throw new Error(`Missing value for configuration key '${key}'`);
  }
}

interface Env {
  server_port: number;
  server_bind: string;
  server_trusted_proxies: string;
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
  logging_mode: string;
  logging_file_path: string;
  logging_format: string;
  logging_level: string;
  node_env: string;
  debug_http_delay: number;
}

const env: Record<string, unknown> = {};
export class ConfigLoadingError extends Error {}

function load() {
  const envMap = parseFile(".env");
  const typeMap = parseFile(".env.types");
  const defaultMap = parseFile(".env.defaults");
  for (const key in typeMap) {
    const value = resolve(key, envMap, defaultMap);
    if (typeMap[key] == "string") {
      env[key] = value;
    } else if (typeMap[key] == "number") {
      env[key] = parseInt(value);
    } else if (typeMap[key] == "boolean") {
      env[key] = value === "true";
    } else {
      throw new ConfigLoadingError(
        `Invalid type '${typeMap[key]}' for key '${key}'`
      );
    }
  }
}

load();

export class ConfigError extends Error {
  constructor(key: keyof Env, message: string) {
    super(
      `Configuration error in key ${key} '${String(env[key])}': ${message}`
    );
  }
}

const castedEnv: Env = <any>env; // eslint-disable-line @typescript-eslint/no-explicit-any
export default castedEnv;
