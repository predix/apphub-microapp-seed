const path = require('path');
const glob = require('glob');
const merge = require('webpack-merge');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
const pkg = require('../package.json');
const ROOT_PATH = path.resolve(__dirname, '../');

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  const config = genDefaultConfig(storybookBaseConfig, configType);
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.
  config.resolve.modules.push('node_modules');
  config.resolve.extensions.push('.scss');

  // Make whatever fine-grained changes you need
  //config.plugins.push(extractSass);
  //config.module.rules.push(sassRules);

  return config;
};
