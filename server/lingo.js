const i18next = require('i18next');
const middleware = require('i18next-express-middleware');

module.exports = {
  create: ({defaultLanguage}, languagesDict) => {
    i18next
      .use(middleware.LanguageDetector)
      .init({
        lng: defaultLanguage,
        resources: languagesDict
      });

    return {
      middleware: () => middleware.handle(i18next)
    }
  }
};