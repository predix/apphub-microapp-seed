const fs = require('fs');
const path = require('path');
const jsonParser = require('body-parser').json();
const log = require('../logger')('routers/nav');
const express = require('express');

module.exports = (app) => {
  log.debug('loaded');
  const router = new express.Router();
  const nav = app.models.nav;

  router.route('/api/nav')
    .post((req, res) => {
      if(req.body){
        nav.update(req.body);
        res.status(201).send(nav.toArray());
      } else {
        res.status(400).send({error:'Must provide a request body'});
      }
    })
    .put((req, res) => {
      nav.update(req.body);
      res.status(200).send(nav.toArray());
    })
    .put((req, res) => {
      nav.update(req.body);
      res.status(200).send(nav.toArray());
    })
    .get((req, res) => {
      res.status(200).send(nav.read());
    })
  ;

  app.use(router);
  return this;
};
