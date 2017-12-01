const log = require('../logger')('routes');

module.exports = function(app) {
  log.debug('loaded');

  app.use(require('./api')());
  app.use(require('./api/nav')());
};
