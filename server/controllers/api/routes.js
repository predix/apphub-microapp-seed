/**
 * @description API Routes
 */
module.exports = (app) => {
  const log = app.middleware.application.getLogger('controllers:api');
  const controller = app.controllers.api.controller;

  app.route('/api')
    .get(controller.index);

  app.route('/api/example')
    .get(controller.all)
    .post(controller.post);

  app.route('/api/example/:id')
    .get(controller.get)
    .put(controller.put)
    .delete(controller.delete);


  return this;
};
