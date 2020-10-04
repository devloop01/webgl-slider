const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: {
		index: "./src/js/index.js",
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: "babel-loader",
				exclude: /node_modules/,
			},

			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
			{
				test: /\.html$/,
				loader: "html-loader",
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				loader: "file-loader",
				options: {
					name: "[name].[ext]",
					outputPath: "images/",
					esModule: false,
				},
			},

			{
				test: /\.glsl$/,
				use: ["raw-loader", "glslify-loader"],
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "index.html",
			inject: true,
			chunks: ["index"],
			hash: true,
		}),
		new MiniCssExtractPlugin({
			filename: "styles/[name].css",
			chunkFilename: "[id].css",
		}),
	],
};
