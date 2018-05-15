/**
 * Production backend-end webpack configuration
 */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const defaultSetup = module.exports = () => ({
  extends: 'base',
  name: 'server',
  target: 'node',
  stats: true,
  node: {
    global: true,
    process: true,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },
  entry: {
    server: './server/index.js'
  },
  // in order to ignore all modules in node_modules folder
  externals: [ nodeExternals() ],
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'server/middleware/swagger/Api.yaml'
      }
    ])]
});

module.exports.library = (params) => {
  const config = defaultSetup(params);
  config.output.libraryTarget = 'commonjs2';
  return config;
};