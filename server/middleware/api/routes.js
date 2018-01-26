const controller = require('./controller');
const log = require('../../common/logger')('controllers:api');

/**
 * @description API Routes
 */
module.exports = (app) => {

  app.route('/api')
    .get(controller.index);

  app.route('/api/example')
    .get(controller.all)
    .post(controller.post);

  app.route('/api/example/:id')
    .get(controller.get)
    .put(controller.put)
    .delete(controller.delete);


  return app;
};
