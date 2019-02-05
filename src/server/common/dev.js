/* istanbul ignore file */
const path = require('path');
const log = require('./logger')('dev');

module.exports = function (app) {
  const config = require('../../../webpack.config.js')();
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackServerMiddleware = require('webpack-server-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);

  const devMiddlewareOptions = {
    stats: 'minimal',
    hot: true,
    logTime: true,
    host: process.env.HOST || 'localhost',
    publicPath: '/',
    contentBase: [
      path.resolve(__dirname, '../../../assets'),
      path.resolve(__dirname, '../../')
    ],
    setup(instance) {
      instance.use(webpackServerMiddleware(compiler));
    }
  };

  log.debug('devMiddleWareOptions', devMiddlewareOptions);
  // devMiddleware.addDevServerEntrypoints(config, devMiddlewareOptions);
  app.use(webpackDevMiddleware(compiler, devMiddlewareOptions));

  // NOTE: Only the client bundle needs to be passed to `webpack-hot-middleware`.
  app.use(webpackHotMiddleware(compiler.compilers.find(c => c.name === 'client'), {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }));

  /*
  console.log('webpackDevMiddleware', webpackDevMiddleware);
  app.get('*', function response(req, res) {
    res.write(
      webpackDevMiddleware.fileSystem.readFileSync(path.join(__dirname, '../../../dist/index.html'))
    );
    res.end();
  }); */
};
