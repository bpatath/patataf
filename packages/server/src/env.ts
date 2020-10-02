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

export class ConfigLoadingError extends Error {}

export type EnvConfig = Record<string, unknown>;
const env: EnvConfig = {};

export function loadEnvConfig(): EnvConfig {
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
  return env;
}
