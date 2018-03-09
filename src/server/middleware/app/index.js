const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const session = require('express-session');
const Logger = require('../../common/logger');
const sessionOptions = require('../../common/session');
const log = Logger('application');
/**
 * Application level middleware
 */
module.exports = function(app) {
  
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
    log.error('clientErrorHandler', err);
    if (req.xhr) {
      res.status(500).json({error: 'Something failed!'});
    } else {
      next(err);
    }
  };

  //Handle rendering error
  const errorHandler = (err, req, res, next) => {
    log.error('errorHandler', err);
    if(req.is('application/json')){
      res.status(500).json({error: 'Something failed!'});
    } else {
      res.status(500).send({error: err});
    }

  };

  //Handle logging error
  const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
  };

  app.set('x-powered-by', false);


  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(session(sessionOptions));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));



  /* istanbul ignore next */
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    log.debug('Setting production only settings.');
    app.use(serveStatic(path.resolve(__dirname, './public'), staticServerConfig));
    app.use(serveStatic(path.resolve(__dirname, '.'), staticServerConfig));
  }

  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);

  // TODO: Add some access methods
  app.getLogger = (name) => {
    return Logger(name);
  };

  app.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }

  return app;
};
