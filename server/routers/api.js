const log = require('../logger')('routers/api');
const express = require('express');


/**
 * @description API Routes
 */
module.exports = (app) => {
  log.debug('loaded');
  const router = new express.Router();

  router.route('/api?')
    .all((req, res, next) => {
      next();
    })
    .get((req, res, next) => {
      res.status(200).json({
        message: 'Welcome to API'
      });
    })
    .put((req, res, next) => {
      res.status(200).json({
        message: 'Updated'
      });
    })
    .post((req, res, next) => {
      res.status(201).json({
        message: 'Saved'
      });
    })
    .delete((req, res, next) => {
      res.status(200).json({
        message: 'Removed'
      });
    });
    app.use(router);
  return this;
};
