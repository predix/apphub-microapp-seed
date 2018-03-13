/**
 * Development front-end webpack configuration
 */
const pkg = require('../package.json');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const Dotenv = require('dotenv-webpack');

const envPath = path.resolve(__dirname, '../.env');

console.log('envPath', envPath);
module.exports = () => ({
    name: 'client',
    extends: 'base',
    target: 'web',
    //context: path.resolve(__dirname, '../src'),
    entry: [
      'main.js',
     // 'webpack/hot/dev-server', 
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&name=client',
      //'react-hot-loader/patch'
    ],
    node: {
      global: true,
      process: true,
      Buffer: false,
      __filename: false,
      __dirname: false,
      setImmediate: false
    },
    stats: 'errors-only',
    //output: {},
    plugins: [
        
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        //
        new Dotenv({
          path: envPath
        }),
      /*
        new LiveReloadPlugin({
          appendScriptTag: true
        }),
        */
      //new webpack.optimize.OccurenceOrderPlugin(),
      //https://github.com/jantimon/html-webpack-plugin#configuration
      new HtmlWebpackPlugin({
        template: './index.ejs',
        inject: 'body',
        hash: true,
        title: pkg.name,
        minify: {
          collapseWhitespace: false
        },
        env: process.env
      })
    ]
});
