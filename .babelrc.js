module.exports = {
	"presets": [
      ["@babel/env", {
        targets: {
          node: true
        }
      }],
      ["@babel/preset-react",{
        development: process.env.NODE_ENV === "development",
      }],
			"@babel/typescript"
	],
	"plugins": [
			"babel-plugin-transform-typescript-metadata",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", { "loose": true }],
			"@babel/proposal-object-rest-spread",
      ["babel-plugin-root-import", { "rootPathSuffix": "./src" }]
	]
}
