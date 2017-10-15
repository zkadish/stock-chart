const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextWebpackPlugin({
  filename: '[name].css',
  disable: process.env.NODE_ENV === 'development',
});

const ENTRY_PATH = process.env.NODE_ENV === 'development' ? './src/javascripts/support/app-support.js' : './src/javascripts/app.js';

console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('entryPath:', ENTRY_PATH);

module.exports = {
  entry: {
    // 'app-support': './src/javascripts/support/app-support.js',
    'stock-chart': ENTRY_PATH,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'stockChart',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
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
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'src': path.resolve(__dirname, 'src'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      DEVELOPMENT: JSON.stringify(process.env.NODE_ENV === 'development'),
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
    }),
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
}
