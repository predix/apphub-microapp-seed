const i18next = require('i18next');
const middleware = require('i18next-express-middleware');
const locales = require('./locales/index');



module.exports = function(app){
  const Lingo = {
    locales: locales,
    create: ({
               defaultLanguage
             }, languagesDict) => {
      i18next.use(middleware.LanguageDetector).init({lng: defaultLanguage, resources: languagesDict});
      return {
        middleware: () => middleware.handle(i18next)
      }
    }
  };

  app.use(Lingo.create({
    defaultLanguage: 'en'
  }, Lingo.locales).middleware());

};
