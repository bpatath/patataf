import path from "path";
import resolve from "resolve";

const appDir = process.cwd();
function appPath(...args: string[]) {
  return path.join(appDir, ...args);
}

//function wpPath(...args: string[]) {
//  return path.join(__dirname, ...args);
//}

const paths = {
  appSource: appPath("src"),
  appNodeModules: appPath("node_modules"),
  clientOutput: appPath("public"),
  serverOutput: appPath("build"),
  devServerOutput: "/",

  clientEntry: require.resolve("../../entry/client.ts"),
  serverEntry: require.resolve("../../entry/server.ts"),
  devServerEntry: require.resolve("../../entry/dev-server.ts"),

  publicPath: "/assets",
  clientStats: "build/clientStats.json",
  serverStats: "build/serverStats.json",
  clientReport: appPath("public", "report.html"),
};

export function resolveAppModule(name: string): string {
  return resolve.sync(name, {
    basedir: paths.appNodeModules,
  });
}

export default paths;
