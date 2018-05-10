const path = require('path');
const pkg = require('./package.json');

const Config = {
  appName: pkg.name,
  port: process.env.PORT || 9001,
  pkg,
  paths: {
    static: './public',
    dest: path.resolve(__dirname, './build'),
    src: path.resolve(__dirname, './src'),
    test: './test',
    modules: [
      path.resolve(__dirname, './src')
    ],
    alias: {
    }
  },
  env: {
    production: process.env.NODE_ENV === 'production',
    test: process.env.NODE_ENV === 'test'
  }
};

module.exports = Config;
