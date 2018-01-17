require('./common/env');
const config = require('../config');
const Server = require('./common/server');
const log = require('./common/logger')('server');

const {env} = process;
const app = new Server(null, config).router();
const port = env.PORT || 9000;

//If development mode
if (env.NODE_ENV === 'development') {
  log.debug('Loading webpack middleware');

  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('../webpack.config.js');
  const compiler = webpack(config);

  app.getExpressApp().use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));
}

if (require.main === module) {
  log.debug('server was ran directly');
  app.listen(port, () =>{
    console.log(`Running on port ${port}`)
  });
} else {
  log.debug('server was required as a module');
  module.exports = app;
}
