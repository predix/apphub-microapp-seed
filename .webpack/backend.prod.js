const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const defaultSetup = module.exports = () => ({
  extends: 'base',

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
  target: 'node',
  // in order to ignore all modules in node_modules folder
  externals: [nodeExternals()],

  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'server/middleware/swagger/Api.yaml',
        to: './'
      }
    ])]
});

module.exports.library = (params) => {
  const config = defaultSetup(params);
  config.output.libraryTarget = 'commonjs2';
  return config;
};
