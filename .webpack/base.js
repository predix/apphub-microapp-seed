const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const config = require('../config.js');
const pkg = require('../package.json');
const parts = require('./webpack.parts');
const {
  NODE_ENV
} = process.env;

const commonConfig = merge([{
    context: path.join(__dirname, '../src'),
    output: {
      filename: `[name].js`,
      path: path.join(__dirname, '../dist')
    }
  },
  parts.loadResolver(),
  parts.loadSvgs({
    exclude: /node_modules/
  }),
  parts.loadMds({
    exclude: /node_modules/
  }),
  parts.loadIcos({
    exclude: /node_modules/
  })
]);


// File: ./.webpack/base.js
module.exports = () => commonConfig;
