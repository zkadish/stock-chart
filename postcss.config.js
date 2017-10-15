const nanoOptions = {
  autoprefixer: false,
};

console.log('POSTCSS CONFIG');
console.log(process.env.NODE_ENV);

module.exports = {
  // parser: 'sugarss',
  sourceMap: true,
  plugins: {
    // 'postcss-import': {},
    'postcss-cssnext': {},
    // autoprefixer: {},
    cssnano: process.env.NODE_ENV === 'production' ? nanoOptions : false,
  },
};
