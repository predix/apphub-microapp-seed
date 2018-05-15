/**
 * Production backend-end webpack configuration
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const defaultSetup = module.exports = () => merge([{
    extends: 'base',
    name: 'server',
    target: 'node',
    stats: true,
    entry: {
      server: './server/index.js'
    },
    // in order to ignore all modules in node_modules folder
    externals: [nodeExternals()],
    plugins: []
  },
  parts.setDefaults()
]);

module.exports.library = (params) => {
  const config = defaultSetup(params);
  config.output.libraryTarget = 'commonjs2';
  return config;
};
