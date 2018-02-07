const config = require('./config');
const webpack = require('webpack');
//module.exports = webpackConfig

// File: ./webpack.config.js
const webpackNodeUtils = require('webpack-node-utils');

// The directory where the configuration files are.
const directory = '.webpack';

// Use a environment variable to detect the target
const target = process.env.BUILD_TARGET || 'frontend';

// Use the `NODE_ENV` environment variable to detect the build type.
const type = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

// And another environment variable to detect the variation
const variation = process.env.BUILD_AS_LIB === 'true' ? 'library' : '';

// Should the module add a timestamp hash on the parameters so I can use when creating the files?
const createHash = type === 'prod';

// Define some parameters you would need access on your configurations
const params = {
  //HTMLTitle: 'Hello world!',
  //outputDir: './dist/'
};

const webpackConfigs = [
  webpackNodeUtils.config(directory, 'frontend', type, createHash, params, variation),
  webpackNodeUtils.config(directory, 'backend', type, createHash, params, variation)
];

// Finally, get and export the configuration
module.exports = webpackConfigs;
//module.exports = webpackNodeUtils.config(directory, target, type, createHash, params, variation);
