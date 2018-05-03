const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const session = require('express-session');
const log = require('../../common/logger')('middleware-app');
const sessionOptions = require('../../common/session');


/**
 * Application level middleware
 */
module.exports = function (app) {
  const setStaticAssetsCacheControl = (res) => {
    if (res && res.req && res.req.get('cache-control')) {
      res.set('cache-control', res.req.get('cache-control'));
    }
  };
  const staticServerConfig = {
    setHeaders: setStaticAssetsCacheControl
  };

  // Handle ajax errors so clients wont hang
  const clientErrorHandler = (err, req, res, next) => {
    log.error('clientErrorHandler', err);
    if (req.xhr) {
      return res.status(500).json({ error: 'Something failed!' });
    }
    return next(err);
  };

  // Handle rendering error
  const errorHandler = (err, req, res) => {
    log.error('errorHandler', err);
    if (req.is('application/json')) {
      return res.status(500).json({ error: 'Something failed!' });
    }
    return res.status(500).send({ error: err });
  };

  // Handle logging error
  const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    log.error('error', err);
    next(err);
  };

  app.set('x-powered-by', false);

  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(session(sessionOptions));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    log.debug('Setting production only settings.');
    app.use(serveStatic(path.resolve(__dirname, './public'), staticServerConfig));
    app.use(serveStatic(path.resolve(__dirname, './'), staticServerConfig));
  }

  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);

  return app;
};
