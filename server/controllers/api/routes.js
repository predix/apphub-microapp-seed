const log = require('../../common/logger')('api/routes');
const express = require('express');

/**
 * @description API Router
 */
module.exports = (app) => {
  const controller = app.controllers.api.controller;

  const router = express
    .Router()
    .get('/', controller.all)
    .get('/:id', controller.get)
    .put('/:id', controller.put)
    .delete('/:id', controller.delete)
    .post('/', controller.post)

  app.get('/api', controller.index);
  app.use('/api/example?', router);
  return this;
};
