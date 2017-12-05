'use strict';
const path = require('path');
const express = require('express');
const load = require('consign');
const proxy = require('express-request-proxy');
const routesList = require('express-api-routes-list');

module.exports = (app) => {
  /**
   *  Express v3 application instance
   */
  if (!app) {
    app = express();
  }
  const config = require('../config');
  const log = require('./logger')('app');
  const port = config.port;

  /**
   *  Autoload Configuration.
   */
  load('config').into(app);
  for (var environment in app.config) {
    if (environment == app.get('env')) {
      console.log('Loading', environment);
      for (var key in app.config[environment]) {
        app.set(key, app.config[environment][key]);
      }
    }
  }

  /**
   *  Autoload models, controllers and routes into application instance.
   */
  load({cwd: 'server'})
    .include('models')
    .then('middleware')
    .then('routers')
    .into(app);


  console.log(routesList(app).toString());

  var http;
  const boot = function(cb) {
    http = require('http').Server(app);
    log.debug('Boot');
    http.listen(port, function() {
      log.debug(`Started on port ${port}`);
      if (cb) {
        cb();
      }
    });
  };

  const shutdown = function(cb) {
    http.close(cb);
    log.debug(`Shutdown`);
  };

  /* istanbul ignore if */
  if (require.main === module) {
    log.debug('running as main module');
    boot();
  } else {
    app.boot = boot;
    app.shutdown = shutdown;
    app.port = port;
  }

  return app;
};
