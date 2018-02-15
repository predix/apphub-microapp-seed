/**
 * Production front-end webpack configuration
 */
const pkg = require('../package.json');
const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;
const OfflinePlugin = require('offline-plugin');


module.exports = () => ({
  name: 'client',
  extends: 'base',
  target: 'web',
  context: path.resolve(__dirname, '../src'),
  entry: {
    main: 'main.js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.BannerPlugin({ banner: "hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]" }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'manifest', async: true, minChunks: Infinity }),

    //https://webpack.js.org/plugins/commons-chunk-plugin/#options
    new webpack.optimize.CommonsChunkPlugin({
      async: false, name: 'vendor', filename: 'vendor.js',
      //minChunks: Infinity
      minChunks(module, count) {
        var context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      }
    }),
    //https://github.com/jantimon/html-webpack-plugin#configuration
    new HtmlWebpackPlugin({
      template: './index.ejs',
      inject: false,
      title: pkg.name,
      minify: {
        collapseWhitespace: true
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: './assets/**/*.*',
        to: './'
      },
      {
        from: './manifest.json'
      },
      {
        from: './favicon.ico'
      }
    ]),
    //https://github.com/NekR/offline-plugin#setup
    /**/
    new OfflinePlugin({
      appShell: '/',
      relativePaths: true,
      AppCache: false,
      ServiceWorker: {
        events: true,
        // TODO: This needs to be the apphub/{microapp-path}
        scope: '',
        cacheName: `${pkg.name}`,
        prefetchRequest: {
          credentials: 'same-origin',
          mode: 'cors'
        }
      },
      externals: [
        'https://dzlpbrbc7yvq0.cloudfront.net/predixdev/fonts/2.0.0/GEInspiraSans.woff',
        'https://dzlpbrbc7yvq0.cloudfront.net/predixdev/fonts/2.0.0/GEInspiraSans-Bold.woff',
        'https://dzlpbrbc7yvq0.cloudfront.net/predixdev/fonts/2.0.0/GEInspiraSans-Italic.woff'
      ]

    }),
    new CriticalPlugin({
      src: 'index.html',
      inline: true,
      minify: true,
      dest: 'index.html'
    })
  ]
});
