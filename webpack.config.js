const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const GLOBALS = {
  __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
};

const extractSass = new ExtractTextWebpackPlugin({
  filename: '[name].css',
  // disable: process.env.NODE_ENV === 'development',
});

const ENTRY_PATH = process.env.NODE_ENV === 'development' ? './src/webpack-dev-entry.js' : './src/stock-chart.js';

console.log('GLOBALS:', GLOBALS.__DEV__);
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('entryPath:', ENTRY_PATH);

module.exports = {
  entry: {
    stockchart: ENTRY_PATH,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sotck-chart.js',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: ['src', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss|.css?$/,
        loader: extractSass.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new HtmlWebpackPlugin({
      template: './src/stock-chart.html',
    }),
    extractSass,
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: '/dist',
    hot: true,
    port: 8080,
  },
};
