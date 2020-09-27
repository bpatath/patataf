import paths from "./paths";
import { Configuration } from "webpack";
import commonConfig, { babelPlugins } from "./common";
import { merge } from "webpack-merge";

import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const webpackDevClientEntry = require.resolve(
  "react-dev-utils/webpackHotDevClient"
);

const clientConfig: Configuration = {
  entry: isDev
    ? [webpackDevClientEntry, paths.clientEntry]
    : [paths.clientEntry],

  output: {
    path: paths.clientOutput,
  },

  optimization: {
    splitChunks: {
      chunks: "all",
      name: false,
    },
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/i,
        include: [paths.appSource],
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/env",
            ["@babel/preset-react", { development: isDev }],
            "@babel/typescript",
          ],
          compact: isProd,
          cacheDirectory: true,
          cacheCompression: false,
          plugins: babelPlugins,
        },
      },
    ],
  },

  plugins: [
    // React refresh (from CRA config)
    new ReactRefreshWebpackPlugin({
      /*overlay: {
        entry: webpackDevClientEntry,
        module: require.resolve("react-dev-utils/refreshOverlayInterop"),
        sockIntegration: false,
      },*/
    }),
  ],

  // Mock modules not available in browser so that importing
  // (not running) them always works.
  node: {
    module: "empty",
    dgram: "empty",
    dns: "mock",
    fs: "empty",
    http2: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
  },
};

export default merge(commonConfig, clientConfig);
