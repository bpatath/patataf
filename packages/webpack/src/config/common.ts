import paths from "./paths";
import { Configuration } from "webpack";

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
  "@babel/proposal-object-rest-spread",
];
if (isDev) {
  babelPlugins.push(require.resolve("react-refresh/babel"));
}

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
    globalObject: "typeof self !== 'undefined' ? self : this",
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
    //new webpack.DefinePlugin(env.stringified),

    // Hot updates
    //isDev && new webpack.HotModuleReplacementPlugin(),

    // Watch for 'npm install' on missing deps to start recompiling
    isDev && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
  ].filter(<T>(v: T | false): v is T => !!v),
};

export default commonConfig;
