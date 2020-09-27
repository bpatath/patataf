import paths from "./paths";
import { Configuration } from "webpack";
import { serverBase } from "./server";
import { merge } from "webpack-merge";

const devServerConfig: Configuration = merge(serverBase, {
  entry: [paths.devServerEntry],
  output: {
    path: paths.devServerOutput,
    filename: "server.js",
    libraryTarget: "commonjs2",
  },
});

export default devServerConfig;
