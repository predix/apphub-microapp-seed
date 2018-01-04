const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const session = require('express-session');
const Logger = require('../common/logger');
const log = Logger('application');
/**
 * Application level middleware
 */
module.exports = (app) => {

  const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    name: process.env.COOKIE_NAME || 'test',
    maxAge: 30 * 60 * 1000, // expire token after 30 min.
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: app.get('env') === 'production'
    }
  };

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
    res.status(500).render('error', {error: err});
  };

  //Handle logging error
  const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
  };

  app.set('x-powered-by', false);
  app.set('trust proxy', 1);
  app.use(serveStatic(path.resolve(__dirname, '..', '..', 'public'), staticServerConfig));

  app.use(cookieParser(process.env.SESSION_SECRET));
  app.use(session(sessionOptions));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // TODO: Production only settings
  // ========================================================================
  if (app.get('env') === 'production') {

    log.debug('Setting production only settings.');
    app.use(serveStatic(path.resolve(__dirname, '..', '..', 'build'), staticServerConfig));
  }

  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);

  // TODO: Add some access methods
  this.getLogger = (name) => {
    return Logger(name);
  };

  this.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  }

  return this;
};
