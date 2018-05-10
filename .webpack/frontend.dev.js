/**
 * Development front-end webpack configuration
 */
const merge = require('webpack-merge');
const path = require('path');

const pkg = require('../package.json');
const parts = require('./webpack.parts');
const envPath = path.resolve(__dirname, '../.env');
const developmentConfig = merge([{
    name: 'client',
    extends: 'base',
    target: 'web',
    entry: [
      'main.js',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&name=client'
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
      sourceMap: true,
      minimize: true
    }
  }),
  parts.loadImages(),
  parts.generateSourceMaps()
]);

module.exports = () => developmentConfig;
