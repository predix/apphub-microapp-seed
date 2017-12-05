const path = require('path');
const log = require('../logger')('middleware/application');
const Lingo = require('../lingo');
const languagesDict = require('../../static/locales');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const setStaticAssetsCacheControl = (res, path) => {
  if (req.get('cache-control')) {
    res.set('cache-control', req.get('cache-control'));
  }
};

const staticServerConfig = {
  setHeaders: setStaticAssetsCacheControl
};

/**
 * application middleware
 */
module.exports = function(app) {
  app.set('x-powered-by', false);

  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(Lingo.create({ defaultLanguage: 'en' }, languagesDict).middleware());
  app.use(serveStatic(path.resolve(__dirname, '..', '..', 'static'), staticServerConfig));

  // TODO: Production only settings
  // ========================================================================
  if(app.get('env') === 'production'){
    log.debug('Setting production only settings.');
    app.use(serveStatic(path.resolve(__dirname, '..', '..', 'build'), staticServerConfig));
  }


  return this;
};
