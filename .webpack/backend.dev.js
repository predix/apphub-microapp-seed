/**
 * Development backend-end webpack configuration
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const defaultSetup = module.exports = () => ({
  extends: 'base',
  name: 'server',
  target: 'node',
  entry: [
    './server/index.js'
  ],
  devtool: 'source-map',
  externals: [
    'predix-ui',
    nodeExternals()
  ],
  plugins: [],
  output: {
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  }
});

module.exports.library = (params) => {
  const config = defaultSetup(params);
  config.output.libraryTarget = 'commonjs2';
  return config;
};
