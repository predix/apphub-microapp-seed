const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');

const Lingo = require('../lingo');
const languagesDict = require('../../static/locales');

const setStaticAssetsCacheControl = (res, path) => {
  if (res && res.req && res.req.get('cache-control')) {
    res.set('cache-control', res.req.get('cache-control'));
  }
};

const staticServerConfig = {
  setHeaders: setStaticAssetsCacheControl
};


module.exports = (app) =>{
  app.set('x-powered-by', false);
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(Lingo.create({ defaultLanguage: 'en' }, languagesDict).middleware());
  app.use(serveStatic(path.resolve(__dirname, '..', '..', 'static'), staticServerConfig));
  app.use(serveStatic(path.resolve(__dirname, '..', '..', 'public'), staticServerConfig));

  // TODO: Production only settings
  // ========================================================================
  if(app.get('env') === 'production'){
    log.debug('Setting production only settings.');
    app.use(serveStatic(path.resolve(__dirname, '..', '..', 'build'), staticServerConfig));
  }

  return this;
};
