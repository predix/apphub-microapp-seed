const fs = require('fs');
const path = require('path');
const jsonParser = require('body-parser').json();
const log = require('../logger')('routers/nav');
const express = require('express');

const navFilePath = path.resolve(__dirname, '../nav.json');

var navMap = {};
const readNavFile = () => {
  var tmp = JSON.parse(fs.readFileSync(navFilePath, 'utf8'));
  for (var i = 0; i < tmp.length; i++) {
    navMap[tmp[i].path] = tmp[i];
  }
  log.debug('navMap', navMap);
  return tmp;
};

const navMapToArray = (m)=>{
  var out = [];
  for(var k in m){
    out.push(m[k]);
  }
  return out;
};

const updateNavFile = (item) => {
  log.debug('updateNavFile', item);
  readNavFile();
  navMap[item.path] = item;
  log.debug('updated nav', navMap);
  fs.writeFileSync(navFilePath, JSON.stringify(navMapToArray(navMap)), 'utf8');
};

const createNavFile = (nav) => {
  log.debug('created nav', nav);
  fs.writeFileSync(navFilePath, JSON.stringify(nav), 'utf8');
};

module.exports = (app) => {
  log.debug('loaded');
  const router = new express.Router();

  router.route('/api/nav')
    .post((req, res) => {
      if(req.body){
        updateNavFile(req.body);
        res.status(201).send(navMapToArray(navMap));
      } else {
        res.status(400).send({error:'Must provide a request body'});
      }
    })
    .put((req, res) => {
      updateNavFile(req.body);
      res.status(200).send(navMapToArray(navMap));
    })
    .put((req, res) => {
      updateNavFile(req.body);
      res.status(200).send(navMapToArray(navMap));
    })
    .get((req, res) => {
      res.status(200).send(readNavFile());
    })
    ;

  app.use(router);
  return this;
};
