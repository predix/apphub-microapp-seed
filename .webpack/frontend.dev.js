/**
 * Development front-end webpack configuration
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const pkg = require('../package.json');
const parts = require('./webpack.parts');
const envPath = path.resolve(__dirname, '../.env');
const developmentConfig = merge([{
    mode: 'development',
    name: 'client',
    extends: 'base',
    target: 'web',
    entry: [
      'main'
    ],
    node: {
      global: true,
      process: true,
      Buffer: false,
      __filename: false,
      __dirname: false,
      setImmediate: false
    }
  },
  parts.loadJavaScript({
    include: path.join(__dirname, '../src'),
    exclude: /node_modules/
  }),
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT || 9001,
    contentBase: [
      path.join(__dirname, '../src'),
      path.join(__dirname, '../public'),
      path.join(__dirname, '../dist'),
    ]
  }),
  parts.loadDevCss({
    exclude: /typography/,
    options: {
    }
  }),
  parts.loadImages(),
  parts.generateSourceMaps(),
  parts.loadHtml(),
  parts.setHotModuleReplacement()
]);

module.exports = () => developmentConfig;
