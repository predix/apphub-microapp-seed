const path = require('path');
const defaultSetup = module.exports = () => ({
    extends: 'base',
    context: path.resolve(__dirname, '../server'),
    entry: {
      main: 'index.js'
    },
    output: {
      filename: `[name].server.js`
    },
    plugins: {}
});

module.exports.library = (params) => {
    const config = defaultSetup(params);
    config.output.libraryTarget = 'commonjs2';
    return config;
};
