const path = require('path');
const glob = require('glob');
const merge = require('webpack-merge');
const pkg = require('../package.json');
const ROOT_PATH = path.resolve(__dirname, '../');

// Export a function. Accept the base config as the only param.
module.exports = async ({
                          config,
                          mode
                        }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader',
      {
        loader: 'sass-loader',
        options: {
          importer: require('node-sass-import-once'),
          importOnce: {
            index: true,
            css: true,
            bower: true
          },
          includePaths: ['node_modules', 'bower_components']
        }
      }
    ],
    include: path.resolve(__dirname, '../'),
  });

  config.module.rules.push({
    test: /\.stories\.js?(x)$/,
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre'
  });


  // Return the altered config
  return config;
};
