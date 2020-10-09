import Dockerfile from "./dockerfile";

export const dialectPackage = {
  sqlite: "sqlite3",
  mariadb: "mariadb",
  mysql: "mysql",
  postgres: "pg pg-hstore",
  mssql: "tedious",
};

export type Dialect = keyof typeof dialectPackage;
export type NpmClient = "npm" | "yarn";

export type PatatafImageOptions = {
  port?: number;
  workdir?: string;
  dialect: Dialect;
  npmClient: NpmClient;
};

export function createPatatafBaseImage(opts: PatatafImageOptions): Dockerfile {
  const workdir = opts.workdir || "/code/";
  const port = opts.port || 8080;

  const df = new Dockerfile();
  df.from("node:alpine").workdir(workdir);

  // Install deps
  if (opts.npmClient === "npm") {
    df.copy("package.json package-lock.json", workdir).run(
      "npm ci --only=production"
    );
  } else {
    df.copy("package.json yarn.lock", workdir).run(
      "yarn install --frozen-lockfile --prod"
    );
  }

  // Install app
  df.copy("build/server.js public", workdir)

    // Install dialect
    .run(`npm install ${dialectPackage[opts.dialect]}`)

    // Expose server port
    .environment("server_port", port)
    .expose(port)

    // Start command TODO: entrypoint to run migrations
    .command("node build/server");

  return df;
}
