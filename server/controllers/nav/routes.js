/**
 * @description Nav Router
 */
module.exports = (app) => {
  const log = app.middleware.application.getLogger('controllers:nav');
  const controller = app.controllers.nav.controller;

  app
    .route(['/nav','/api/nav'])
    .all(controller.all)
    .get(controller.get)
    .put(controller.put)
    .post(controller.post)
    .delete(controller.delete);

  return this;
};
