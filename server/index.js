require('./common/env');
const express = require('express');
const routesList = require('express-api-routes-list');
const path = require('path');
const config = require('../config');
const Server = require('./common/server');
const log = require('./common/logger')('server');
const server = new Server(null, config).router();
const app = server.getExpressApp();
const middleware = require('./middleware');
middleware(app);

const isDeveloping = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 9000;

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config.js');
  const compiler = webpack(config);
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: '/',
    contentBase: '../src',
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
    res.write(devMiddleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')));
    res.end();
  });
} else {
  /*
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
  });*/
}

if (require.main === module) {
  log.debug('server was ran directly');
  console.log(routesList(app).toString());
  server.listen(port, () => {
    console.log(`Running on port ${port}`)
  });
} else {
  log.debug('server was required as a module');
  module.exports = server;
}
