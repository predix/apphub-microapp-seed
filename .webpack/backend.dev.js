const path = require('path');
const defaultSetup = module.exports = () => ({
    extends: 'base',
    entry: {
      main: 'server/index.js'
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
