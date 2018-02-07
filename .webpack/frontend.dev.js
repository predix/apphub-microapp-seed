/**
 * Development front-end webpack configuration
 */
const pkg = require('../package.json');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
module.exports = () => ({
    name: 'client',
    extends: 'base',
    target: 'web',
    //context: path.resolve(__dirname, '../src'),
    entry: ['react-hot-loader/patch', 'main.js'],
    node: {
      global: true,
      process: true,
      Buffer: false,
      __filename: false,
      __dirname: false,
      setImmediate: false
    },
    //output: {},
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new LiveReloadPlugin({
        appendScriptTag: true
      }),
      //new webpack.optimize.OccurenceOrderPlugin(),
      //new webpack.HotModuleReplacementPlugin(),
      //https://github.com/jantimon/html-webpack-plugin#configuration
      new HtmlWebpackPlugin({
        template: './index.ejs',
        inject: false,
        title: pkg.name,
        minify: {
          collapseWhitespace: false
        }
      })
    ],
    devServer: {
      port: process.env.PORT || 9000,
      host: 'localhost',
      hot: true,
      compress: true,
      publicPath: '/',
      contentBase: [
        //path.resolve(__dirname, './bower_components'),
        path.resolve(__dirname, './public'),
        path.resolve(__dirname, './src')
      ],
      historyApiFallback: true,
      open: true
    }
});
