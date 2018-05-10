/**
 * Production front-end webpack configuration
 */
const pkg = require('../package.json');
const path = require('path');
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
/*
const c = () => ({
  name: 'client',
  extends: 'base',
  target: 'web',
  context: path.resolve(__dirname, '../src'),
  entry: {
    //polyfills: 'polyfills.js',
    main: 'main.js'
  },
  devtool: 'source-map',
  plugins: [

    //https://webpack.js.org/plugins/commons-chunk-plugin/#options
    new webpack.optimize.CommonsChunkPlugin({
      async: false,
      name: 'vendor',
      filename: 'vendor.js',
      //minChunks: Infinity
      minChunks(module, count) {
        var context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      }
    }),

  ]
});
*/
const productionConfig = merge([{
    name: 'client',
    extends: 'base',
    target: 'web',
    context: PATHS.app,
    entry: {
      main: 'main.js',
      vendor: [
        'react',
        'react-dom',
        'react-router-dom',
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
    devtool: 'source-map',
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
      children: true,
    }
  },
  {
    optimization: {
      minimize: false,
      /*
      splitChunks: {
        name: 'vendor',
        filename: 'vendor.js',
        chunks: 'initial',
        minChunks: 2,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      }*/
      //runtimeChunk: false,
      splitChunks: {
        filename: '[name].bundle.js',
        cacheGroups: {
          default: false,
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            minChunks: 2
          }
        }
      }
    }
  },
  parts.setNoErrors(),
  parts.loadJavaScript({
    include: PATHS.app,
    exclude: /node_modules/
  }),
  //parts.minifyJavaScript(),
  parts.clean('dist'),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      safe: true
    }
  }),
  parts.loadProdCss(),
  parts.loadImages({
    options: {
      limit: 1024,
      name: '[name].[ext]'
    }
  }),
  parts.setCompression(),
  //parts.criticalCSS(),
  parts.offlinePlugin(),
  parts.copyPlugin(),
  parts.bannerPlugin(),
  parts.setAnalyzer(),
  parts.loadHtml()
]);


module.exports = () => productionConfig;
