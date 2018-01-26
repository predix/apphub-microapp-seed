const path = require('path');
const uuid = require('uuid');
const Database = require('../../common/database');

/**
 * Generic database model
 *
 */
module.exports = function(app) {
  const db = new Database(path.resolve(__dirname, '../../.db.json'), {user: {}, docs: []});
  //app.locals.db = db;
  app.use((req, res, next)=>{
    req.app.locals.db = db;
    next();
  });
  return app;
};
