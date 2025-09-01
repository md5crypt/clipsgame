const path = require("path")
const webpack = require("webpack")

module.exports = env => ({
	entry: "./src/index.ts",
	output: {
		filename: "site.js",
		path: path.resolve(__dirname, "dist")
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
		symlinks: false
	},
	mode: env.production ? "production" : "development",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{loader: "ts-loader", options: {onlyCompileBundledFiles: true}}
				]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			__MODULE_NAME: webpack.DefinePlugin.runtimeValue(context => JSON.stringify(path.basename(context.module.resource).replace(/\..+$/, "")), [])
		})
	],
	devServer: {
		compress: env.production,
		port: 9000,
		host: "0.0.0.0",
		devMiddleware: {
			writeToDisk: x => !/\.hot-update\./.test(x)
		},
		static: {
			directory: path.resolve(__dirname),
			watch: false
		},
		allowedHosts: "all",
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		}
	}
})
