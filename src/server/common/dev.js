const path = require('path');

module.exports = function (app) {

  const config = require(path.join(__dirname, '../../../webpack.config.js'))();
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackServerMiddleware = require('webpack-server-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);

  const devMiddlewareOptions = {
    hot: true,
    host: 'localhost',
    publicPath: '/',
    contentBase: [
      //path.resolve(__dirname, './bower_components'),
      path.resolve(__dirname, '../../../public'),
      path.resolve(__dirname, '../../../src')
    ]
  };

  console.log('devMiddleWareOptions', devMiddlewareOptions);

  const devMiddleware = webpackDevMiddleware(compiler, devMiddlewareOptions);
  app.use(devMiddleware);
  // NOTE: Only the client bundle needs to be passed to `webpack-hot-middleware`.
  app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client'),  {
    log: console.log, 
    path: '/__webpack_hmr', 
    heartbeat: 10 * 1000
  }));
  app.use(webpackServerMiddleware(compiler));

  /*
  app.get('*', function response(req, res) {
    res.write(devMiddleware.fileSystem.readFileSync(path.join(__dirname, '../../../dist/index.html')));
    res.end();
  });
  */
};
