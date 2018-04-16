const path = require('path');
const log = require('./logger')('dev');
const express = require('express');

module.exports = function (app) {

  const config = require('../../../webpack.config.js')();
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackServerMiddleware = require('webpack-server-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);

  const devMiddlewareOptions = {
    stats: 'errors-only',
    hot: true,
    compress: true,
    host: 'localhost',
    publicPath: '/',
    setup: function(app) {
      app.use(webpackServerMiddleware(compiler));
    },
    contentBase: [
      path.resolve(__dirname, '../../../assets')
    ]
  };

  log.debug('devMiddleWareOptions', devMiddlewareOptions);

  //devMiddleware.addDevServerEntrypoints(config, devMiddlewareOptions);
  app.use(webpackDevMiddleware(compiler, devMiddlewareOptions));

  // NOTE: Only the client bundle needs to be passed to `webpack-hot-middleware`.
  app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client'),  {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));


  /*
  app.get('*', function response(req, res) {
    res.write(devMiddleware.fileSystem.readFileSync(path.join(__dirname, '../../../dist/index.html')));
    res.end();
  });
  */
};
