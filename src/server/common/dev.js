const path = require('path');

module.exports = function(app){
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackServerMiddleware = require('webpack-server-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../../../webpack.config.js');
  const compiler = webpack(config);
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: '/',
    contentBase: '../../src',

    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  app.use(devMiddleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(devMiddleware.fileSystem.readFileSync(path.join(__dirname, '../../../dist/index.html')));
    res.end();
  });
};
