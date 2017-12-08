const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
/**
 * Application level middleware
 */
module.exports = (app) => {

  const setStaticAssetsCacheControl = (res, path) => {
    if (res && res.req && res.req.get('cache-control')) {
      res.set('cache-control', res.req.get('cache-control'));
    }
  };

  const staticServerConfig = {
    setHeaders: setStaticAssetsCacheControl
  };

  //Handle ajax errors so clients wont hang
  const clientErrorHandler = (err, req, res, next) => {
    if (req.xhr) {
      res.status(500).send({error: 'Something failed!'});
    } else {
      next(err)
    }
  };

  //Handle rendering error
  const errorHandler = (err, req, res, next) => {
    res
      .status(500)
      .render('error', {error: err});
  };

  //Handle logging error
  const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
  };

  app.set('x-powered-by', false);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.SESSION_SECRET));

  app.use(serveStatic(path.resolve(__dirname, '..', '..', 'public'), staticServerConfig));
  app.use(serveStatic(path.resolve(__dirname, '..', '..', 'build'), staticServerConfig));

  // TODO: Production only settings
  // ========================================================================
  if (app.get('env') === 'production') {
    log.debug('Setting production only settings.');

  }

  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);


  return this;
};
