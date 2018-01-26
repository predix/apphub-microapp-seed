const pkg = require('../package.json');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;
const OfflinePlugin = require('offline-plugin');

const webpackPlugins = [
  new webpack.BannerPlugin({
    banner: "hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]"}),
    new webpack.optimize.CommonsChunkPlugin({name: 'manifest', async: true, minChunks: Infinity}),
    /*
  new CriticalPlugin({
      src: 'index.html',
      inline: true,
      minify: true,
      dest: 'index.html'
    }),
  */
    //https://github.com/NekR/offline-plugin#setup
  /*
  new OfflinePlugin({
      relativePaths: true,
      AppCache: false,
      ServiceWorker: {
        events: true,
        // TODO: This needs to be the apphub/{microapp-path}
        scope: ''
      }
    }),*/
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
    })
];


module.exports = () => ({
    extends: 'base',
  context: path.resolve(__dirname, '../src'),
  entry: {
    main: 'main.js'
  },
    //entry: {},
    //output: {},
    plugins: webpackPlugins
});
