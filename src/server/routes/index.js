const controller = require('express-controller-routing');


module.exports = function(app) {
  app.use('/api', controller(require('./api')));
  app.use('/api/nav', controller(require('./nav')));
  app.use('/api/example', controller(require('./example')));
  return app;
};
