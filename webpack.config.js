
const path = require('path');

module.exports = {
  output: {
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    alias: {
      app: path.resolve(__dirname, 'app')
    }
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
//      {
//        test: /app\/.+\.ts$/,
//        exclude: /(node_modules|\.spec\.ts$)/,
//        loader: 'istanbul-instrumenter-loader',
//        enforce: 'post'
//      },
//      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.s?css$/,
        loaders: ['to-string-loader', 'css-loader', 'sass-loader']
      },
      { test: /\.html$/, loader: 'html-loader' }
    ]
  },
//  node: {
//    global: true,
//    child_process: 'empty',
//    dns: 'empty',
//    fs: 'empty',
//    net: ,
//    process: false,
//    utils: 'empty'
//  },
  target: 'node',
  watch: true
};
