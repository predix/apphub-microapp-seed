require('./common/env');
const config = require('../config');
const Server = require('./common/server');
const log = require('./common/logger')('server');

const {env} = process;

const app = new Server(null, config).router();


//If development mode
if (env.NODE_ENV === 'development') {
  console.log('Loading webpack middleware');

  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('../webpack.config.js');
  const compiler = webpack(config);

  app.getExpressApp().use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));
}

if (require.main === module) {
  console.log('was run directly!');

  app.listen(env.PORT || 9000);
} else {
  console.log('was require()d');
  module.exports = app;
}




