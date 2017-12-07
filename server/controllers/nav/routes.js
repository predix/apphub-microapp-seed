const log = require('../../common/logger')('nav/routes');
const express = require('express');

/**
 * @description API Router
 */
module.exports = (app) => {
  log.debug('loaded');
  const router = new express.Router();
  const controller = app.controllers.nav.controller;

  router
    .route('/api/nav')
    .all(controller.all)
    .get(controller.get)
    .put(controller.put)
    .post(controller.post)
    .delete(controller.delete);

  app.use(router);

  return this;
};
