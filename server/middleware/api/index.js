const routes = require('./routes');
const db = require('./db');
module.exports = function(app){

  db(app);
  routes(app);
  return app;
};
