/**
 * Production front-end webpack configuration
 */
const pkg = require('../package.json');
const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');

const publicPath = 'build';

// This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
const PATHS = {
  app: path.join(__dirname, '../src'),
  build: path.join(__dirname, '../build'),
  fixedPath: '/'
};

const productionConfig = merge([{
    name: 'client',
    extends: 'base',
    target: 'web',
    context: PATHS.app,
    output: {
      filename: 'js/[name].[hash].bundle.js',
      //chunkFilename: 'js/[name].bundle.js'
    },
    entry: {
      main: 'main.js',
      vendor: [
        'react',
        'react-popper',
        'prop-types',
        'react-dom',
        'react-router-dom',
        'react-loadable',
        'styled-components',
        'axios',
        'predix-ui'
      ],
      polyfills: [
        'es6-shim',
        'promise-polyfill',
        'whatwg-fetch'
      ]
    },
    bail: false
  },
  {
    stats: {
      colors: false,
      hash: true,
      timings: true,
      assets: true,
      chunks: true,
      chunkModules: true,
      modules: true,
      children: true
    }
  },

  {
    optimization: {
      splitChunks: {
        automaticNameDelimiter: '-',
        chunks: 'all'
      }
    }
    /*
    optimization: {
      //minimize: false,
      splitChunks: {
        filename: '[name].bundle.js',
        cacheGroups: {
          //default: true,
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            minChunks: 2
          }
        }
      }
    }
    */
  },
  parts.generateSourceMaps(),
  parts.setNoErrors(),
  parts.loadJavaScript({
    include: PATHS.app,
    exclude: /node_modules/
  }),
  parts.loadProdCss(),
  parts.loadImages({
    options: {
      limit: 1024,
      name: '[name].[ext]'
    }
  }),
  parts.setCompression(),
  parts.workboxPlugin({
    clientsClaim: true,
    skipWaiting: true,
    importWorkboxFrom: 'local',
    runtimeCaching: [{
      urlPattern: /api/,
      handler: 'networkFirst',
      options: {
        cacheName: 'apphub-microapp-seed-api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60
        },
        // Configure which responses are considered cacheable.
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }]
  }),
  parts.copyPlugin([{
    from: './assets/**/*.*',
    to: './'
  }, {
    from: './manifest.json'
  }, {
    from: './favicon.ico'
  }]),
  //parts.bannerPlugin(),
  parts.setAnalyzer(),
  parts.loadHtml(),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      safe: true
    }
  }),
  parts.criticalCSS(),
  parts.purifyCSS({
    verbose: true,
    moduleExtensions: ['.html', '.js'],
    paths: glob.sync([
      path.resolve(__dirname, '../dist/**')
    ])
  })
]);


module.exports = () => productionConfig;
