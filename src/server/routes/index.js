const controller = require('express-controller-routing');
const Database = require('../common/database');

const DB_NAME = process.env.DB_NAME || 'apphub-microapp-seed';
const { API_DATABASE_ADAPTER } = process.env;

module.exports = function (app) {
  /* eslint consistent-return: ["warn"] */
  app.use((req, res, next) => {
    if (!req.app.locals.db) {
      try {
        Database.getInstance(DB_NAME, { user: {}, docs: [] }, API_DATABASE_ADAPTER || 'memory').then((resp) => {
          req.app.locals.db = resp;
          return next();
        }).catch(next);
      } catch (err) {
        console.log('Falling back to in-memory data store');
        return next(err);
      }
    } else {
      return next();
    }
  });

  app.use('/api', controller(require('./api')));
  app.use('/api/nav', controller(require('./nav')));
  app.use('/api/example', controller(require('./example')));
  return app;
};
