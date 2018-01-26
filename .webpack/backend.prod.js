const path = require('path');
const nodeExternals = require('webpack-node-externals');
const defaultSetup = module.exports = () => ({
    extends: 'base',
    context: path.resolve(__dirname, '../server'),
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
      server: './index.js'
    },
    target: 'node',
    // in order to ignore all modules in node_modules folder
    externals: [nodeExternals()]

    //plugins: {}
});

module.exports.library = (params) => {
    const config = defaultSetup(params);
    config.output.libraryTarget = 'commonjs2';
    return config;
};
