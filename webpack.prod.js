const merge = require('webpack-merge'); // eslint-disable-line
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line
const common = require('./webpack.common.js'); // eslint-disable-line

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin({
      parallel: true,
    }),
  ],
});
