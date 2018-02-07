const path = require('path');

module.exports = function(app){

  const config = require(path.join(__dirname, '../../../webpack.config.js'))();
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackServerMiddleware = require('webpack-server-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(config);

  const devMiddleware = webpackDevMiddleware(compiler, {
    //contentBase: '../../src',
    publicPath: '/'
    //publicPath: config[0].output.publicPath,
  });
  app.use(devMiddleware);
  // NOTE: Only the client bundle needs to be passed to `webpack-hot-middleware`.
  app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client')));
  app.use(webpackServerMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(devMiddleware.fileSystem.readFileSync(path.join(__dirname, '../../../dist/index.html')));
    res.end();
  });
};
