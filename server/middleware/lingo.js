const i18next = require('i18next');
const middleware = require('i18next-express-middleware');
const locales = require('../locales');

const Lingo = {
  create: ({
    defaultLanguage
  }, languagesDict) => {
    i18next.use(middleware.LanguageDetector).init({lng: defaultLanguage, resources: languagesDict});
    return {
      middleware: () => middleware.handle(i18next)
    }
  }
};

module.exports = (app) => {
  app.use(Lingo.create({
    defaultLanguage: 'en'
  }, locales).middleware());
  return this;
};
