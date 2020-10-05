import paths from "./paths";
import { Configuration } from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import { merge } from "webpack-merge";
import commonConfig, { babelPlugins } from "./common";
import { excludeFalse } from "../utils";

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const webpackDevClientEntry = require.resolve(
  "react-dev-utils/webpackHotDevClient"
);

function clientConfig(hmr: boolean): Configuration {
  const clientBabelPlugins = [
    ...babelPlugins,
    hmr && require.resolve("react-refresh/babel"),
  ].filter(excludeFalse);

  return {
    entry: hmr
      ? [webpackDevClientEntry, paths.clientEntry]
      : [paths.clientEntry],

    output: {
      path: paths.clientOutput,
    },

    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
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
              ["@babel/env", { modules: false /* For webpack tree-shaking */ }],
              ["@babel/preset-react", { development: isDev }],
              "@babel/typescript",
            ],
            compact: isProd,
            cacheDirectory: true,
            cacheCompression: false,
            plugins: clientBabelPlugins,
          },
        },
      ],
    },

    plugins: [
      // Clean output directory
      new CleanWebpackPlugin(),

      // React refresh (from CRA config)
      hmr &&
        new ReactRefreshWebpackPlugin({
          /*overlay: {
          entry: webpackDevClientEntry,
          module: require.resolve("react-dev-utils/refreshOverlayInterop"),
          sockIntegration: false,
        },*/
        }),

      // Compress output
      new CompressionPlugin(),

      // Analyzer to optimize bundle size
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: paths.clientReport,
      }),
    ].filter(excludeFalse),

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
}

export default (hmr: boolean): Configuration =>
  merge(commonConfig, clientConfig(hmr));
