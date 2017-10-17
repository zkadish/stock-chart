const merge = require('webpack-merge'); // eslint-disable-line
const common = require('./webpack.common.js'); // eslint-disable-line

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    port: 7777,
    hot: true,
    stats: 'errors-only',
    overlay: true,
  },
});
