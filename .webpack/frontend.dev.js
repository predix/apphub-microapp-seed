const pkg = require('../package.json');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
    extends: 'base',
    context: path.resolve(__dirname, '../src'),
    entry: {
      main: 'main.js'
    },
    //output: {},
    plugins: [
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
