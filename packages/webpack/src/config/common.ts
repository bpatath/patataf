import paths from "./paths";
import webpack, { Configuration } from "webpack";
import { excludeFalse } from "../utils";

import WatchMissingNodeModulesPlugin from "react-dev-utils/WatchMissingNodeModulesPlugin";

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const filename = isProd
  ? "static/js/[name].[contenthash:8].chunk.js"
  : "static/js/[name].chunk.js";

export const babelPlugins = [
  //"babel-plugin-transform-typescript-metadata",
  ["@babel/plugin-proposal-decorators", { legacy: true }],
  ["@babel/plugin-proposal-class-properties", { loose: true }],
  "@babel/plugin-proposal-object-rest-spread",
  "@babel/plugin-proposal-optional-chaining",
  ["graphql-tag", { importSources: ["@apollo/client"] }],
];

const commonConfig: Configuration = {
  mode: isProd ? "production" : isDev ? "development" : undefined,
  bail: isProd,
  devtool: isDev ? "cheap-module-source-map" : false,
  entry: [],

  output: {
    pathinfo: isDev,
    filename,
    chunkFilename: filename,
    publicPath: paths.publicPath,
  },

  optimization: {
    minimize: isProd,
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "~": paths.appSource,
    },
  },

  module: {
    strictExportPresence: true,
    rules: [],
  },

  plugins: [
    // Make env variables available in the code
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.SSR": true, // TODO:
    }),

    // Watch for 'npm install' on missing deps to start recompiling
    isDev && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
  ].filter(excludeFalse),
};

export default commonConfig;
