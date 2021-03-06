var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

var IS_PRODUCTION = process.env.NODE_ENV === 'production';

var config = {

	devtool: 'eval',

	entry: './web/src/index.js',

	output: {
		path: path.join(__dirname, 'web/build/js'),
		filename: 'app.js',
		publicPath: '/'
	},

	plugins: [
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('../css/default.css')
	],

	resolve: {
		modulesDirectories: ['node_modules', 'src'],
		extensions: ['', '.js', '.jsx']
	},

	module: {
		loaders: [
			{
				test: JS_REGEX,
				exclude: /node_modules/,
				include: path.join(__dirname, 'web/src'),
				loader: 'babel'
			},
			{
				test: /\.sass$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader?indentedSyntax')
			},
			{test: /\.css$/, loader: 'style-loader!css-loader'},
			{
				test: /\.(svg|png|jpg)$/,
				loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
			},
			{
				test: /avatar-[0-9]\.png$/,
				loader: 'file?name=../img/[name].[ext]'
			},
			{
				test: /\.(eot|woff|woff2|ttf)$/,
				loader: 'file?name=../fonts/[name].[ext]'
			},
			{
				test: /\.mp3$/,
				loader: 'file?name=../sound/[name].[ext]'
			}
		],

		noParse: /\.min\.js/
	}

};

if (!IS_PRODUCTION) {
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (IS_PRODUCTION) {
	config.devtool = 'source-map';
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.DedupePlugin()
	);
}

module.exports = config;
