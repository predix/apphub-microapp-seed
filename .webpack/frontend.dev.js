/**
 * Development front-end webpack configuration
 */
const pkg = require('../package.json');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';


module.exports = () => ({
    name: 'client',
    extends: 'base',
    target: 'web',
    //context: path.resolve(__dirname, '../src'),
    entry: [
      //'webpack-hot-middleware/client',
      'main.js',
      hotMiddlewareScript,
      'react-hot-loader/patch', 
      
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
      /*
        new LiveReloadPlugin({
          appendScriptTag: true
        }),
        */
      //new webpack.optimize.OccurenceOrderPlugin(),
      //https://github.com/jantimon/html-webpack-plugin#configuration
      new HtmlWebpackPlugin({
        template: './index.ejs',
        inject: false,
        title: pkg.name,
        minify: {
          collapseWhitespace: false
        }
      })
    ]
});
