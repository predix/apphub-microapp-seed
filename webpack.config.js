const config = require('./config');

const webpack = require('webpack');
const glob = require('glob');
const path = require('path');

const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;
const OfflinePlugin = require('offline-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReplacePlugin = require('replace-bundle-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//vars
const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = config.env.production;

const extractSass = new ExtractTextPlugin({filename: '[name].[contenthash].css', disable: false});

/* ============================================
Webpack Plugins
https://webpack.js.org/configuration/#options
============================================ */
const webpackPlugins = ([
  extractSass,
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),

  //https://webpack.js.org/plugins/environment-plugin/#usage
  new webpack.EnvironmentPlugin({'NODE_ENV': process.env.NODE_ENV, 'PRODUCTION': IS_PRODUCTION}),

  //https://www.npmjs.com/package/webpack-bundle-analyzer
  new BundleAnalyzerPlugin({
    generateStatsFile: true,
    openAnalyzer: false,
    reportFilename: 'report.html',
    statsFilename: 'stats.json',
    analyzerMode: 'static'
  }),

  //https://github.com/jantimon/html-webpack-plugin#configuration
  new HtmlWebpackPlugin({
    template: './index.ejs',
    inject: false,
    title: config.appName,
    minify: {
      collapseWhitespace: true
    }
  }),
  new CopyWebpackPlugin([
    {
      from: './locales/*.*',
      to: './locales/[name].[ext]'
    },
    {
      from: './manifest.json',
      to: './'
    }
  ]),
  //https://webpack.js.org/plugins/commons-chunk-plugin/#options
  new webpack.optimize.CommonsChunkPlugin({
    async: false,
    name: 'vendor',
    filename: IS_PRODUCTION
      ? `vendor-[hash].min.js`
      : `vendor-static.js`,
    //minChunks: Infinity
    minChunks(module, count) {
      var context = module.context;
      return context && context.indexOf('node_modules') >= 0;
    }
  })
]);

// TODO: Production only plugins
if (IS_PRODUCTION) {

  //https://webpack.js.org/plugins/banner-plugin/#options
  webpackPlugins.push(new webpack.BannerPlugin({banner: "hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]"}));

  //https://webpack.js.org/plugins/commons-chunk-plugin/#options
  webpackPlugins.push(new webpack.optimize.CommonsChunkPlugin({name: 'manifest', async: true, minChunks: Infinity}));

  webpackPlugins.push(new CriticalPlugin({
    src: 'index.html',
    inline: true,
    minify: true,
    dest: 'index.html'
  }));

  //https://github.com/NekR/offline-plugin#setup
  webpackPlugins.push(new OfflinePlugin({
    relativePaths: true,
    AppCache: false,
    ServiceWorker: {
      events: true,
      // TODO: This needs to be the apphub/{microapp-path}
      scope: '/dev/microapp1'
    }
  }));
}

/***
============================================
Webpack Config
https://webpack.js.org/configuration/#options
============================================
*/
let webpackConfig = {
  context: path.resolve(__dirname, config.paths.src),
  entry: {
    main: 'main.js',
    //vendor: ['']
  },
  output: {
    path: path.resolve(__dirname, config.paths.dest),
    publicPath: '/',
    filename: IS_PRODUCTION
      ? `[name].[hash].bundle.js`
      : `[name].js`
  },
  resolve: {
    extensions: [
      '.jsx',
      '.js',
      '.json',
      '.css',
      '.scss',
      '.html'
    ],
    modules: config.paths.modules,
    alias: config.paths.alias
  },
  module: {
    rules: [

      //.js
      {
        test: /\.js$/,
        include: config.modules,
        exclude: [
          /(bower_components|node_modules)/, /(\*.spec)/
        ],
        use: ['babel-loader']
      },

      //.scss
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                camelCase: true,
                //modules: true,
                sourceMap: true,
                importLoaders: 2,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            //'postcss-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                importer: require('node-sass-import-once'),
                importOnce: {
                  index: true,
                  css: true,
                  bower: true
                },
                includePaths: ['src', 'style', 'node_modules', 'bower_components'].map((d) => path.join(__dirname, d)).map((g) => glob.sync(g)).reduce((a, c) => a.concat(c), [])
              }
            }
          ]
        })
      },
      //.css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                //modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            },
            'postcss-loader'
          ]
        })
      },
      //.txt
      {
        test: /\.(xml|html|txt|md)$/,
        use: ['raw-loader']
      },
      //.svg
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: ['url-loader']
      }
    ]
  },
  plugins: webpackPlugins,
  stats: true,
  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },
  devtool: (
    config.env.production
    ? 'source-map'
    : 'cheap-module-eval-source-map'),
  devServer: {
    port: process.env.PORT || 9090,
    host: 'localhost',
    hot: true,
    compress: true,
    publicPath: '/',
    contentBase: [
      path.resolve(__dirname, './bower_components'),
      path.resolve(__dirname, './public'),
      path.resolve(__dirname, './static'),
      path.resolve(__dirname, './src')
    ],
    historyApiFallback: true,
    open: true,
    // TODO: Setup express app,
    before: (app) =>{
      console.log('webpack.before', app);
      var server = require('./server/common/server');
      var s = new server(app);
      s.router();
    },
    // TODO: Proxy configuation for webpack-dev-server
    proxy: {
      '/api/v2/**': {
        target: 'https://pouchdb.run.aws-usw02-pr.ice.predix.io',
        pathRewrite: {
          "^/api/v2": ""
        }
      }
    }
  }
};

module.exports = webpackConfig;
