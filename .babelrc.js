module.exports = {
  "env": {
    "es5": {
      "presets": [
        ["@babel/env", {
          targets: { node: true },
        }],
        ["@babel/preset-react",{
          development: process.env.NODE_ENV === "development",
        }],
        "@babel/typescript"
      ],
    },
    "modules": {
      "presets": [
          ["@babel/env", {
            modules: false
          }],
          ["@babel/preset-react",{
            development: process.env.NODE_ENV === "development",
          }],
          "@babel/typescript"
      ]
    }
  },
  "plugins": [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
    ["babel-plugin-root-import", { "rootPathSuffix": "./src" }],
    "graphql-tag",
  ]
}
