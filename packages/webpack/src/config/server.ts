import webpack from "webpack";
import paths from "./paths";
import { Configuration } from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import commonConfig, { babelPlugins } from "./common";
import { merge } from "webpack-merge";
import nodeExternals from "webpack-node-externals";

const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";

export const serverBase: Configuration = merge(commonConfig, {
  target: "node",

  // Don't pack node_modules since node can require them
  externals: [nodeExternals()],

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/i,
        include: [paths.appSource],
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/env", { targets: { node: true } }],
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
    new webpack.DefinePlugin({
      "process.env.CLIENT_OUTPUT": JSON.stringify(paths.clientOutput),
    }),
  ],
});

const serverConfig: Configuration = {
  entry: [paths.serverEntry],
  output: {
    path: paths.serverOutput,
    filename: "server.js",
  },

  plugins: [
    // Clean output directory
    new CleanWebpackPlugin(),
  ],
};

export default merge(serverBase, serverConfig);
