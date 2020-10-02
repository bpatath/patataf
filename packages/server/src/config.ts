import { loadEnvConfig } from "./env";

export interface RootConfig {
  node_env: string;

  server_port: number;
  server_bind: string;
  server_trusted_proxies: string;
  server__http_delay: number;

  logging_mode: string;
  logging_file_path: string;
  logging_format: string;
  logging_level: string;
}

export function loadRootConfig(): RootConfig {
  return <any>loadEnvConfig(); // eslint-disable-line @typescript-eslint/no-explicit-any
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
