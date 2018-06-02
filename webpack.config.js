
const path = require('path');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var CompressionPlugin = require("compression-webpack-plugin");
// const webpack = require('webpack');

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
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.css$/,
        loaders: [
          'to-string-loader',
          // 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          // 'to-string-loader',
          'style-loader',
          'css-loader',
          'sass-loader'
          // {
          //   loader: 'sass-loader',
          //   // options: {
          //   //   includePaths: [path.resolve(__dirname, 'node_modules')]
          //   // }
          // }
        ]
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
  watch: true,
  plugins: [
    /*
    new BundleAnalyzerPlugin({
      defaultSizes: 'stat'
      //defaultSizes: 'parsed'   // not yet supported
      //defaultSizes: 'gzip'   // not yet supported
    }),
    */
    // Tree shake and compress
    // new webpack.optimize.UglifyJsPlugin({
    // new webpack.optimize.minimize({
    //   compress: {
    //     warnings: false
    //   },
    //   output: {
    //     comments: false
    //   },
    //   sourceMap: false
    // }),
    // new CompressionPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.js$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // }),
  ]
};
