const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

console.log('webpack loaded!');

const extractSass = new ExtractTextWebpackPlugin({
  filename: "[name].[contenthash].css",
  // disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: './src/stock-chart.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sotck-chart.js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: ['src', 'node_modules']
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss|.css?$/,
        loader: extractSass.extract({
          use: [{
              loader: 'css-loader'
            }, {
              loader: 'sass-loader'
            }],
            fallback: 'style-loader'
        })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/stock-chart.html'
    }),
    extractSass
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: '/dist',
    hot: true
  }
}