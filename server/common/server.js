const path = require('path');
const express = require('express');
const load = require('consign');
const proxy = require('express-request-proxy');
const routesList = require('express-api-routes-list');
const os = require('os');
const http = require('http');


const log = require('./logger')('server');
const swaggerify = require('./swagger');

const app = new express();

class Server {
  constructor(config) {
    log.info('contructor', config);
    load({cwd: 'server'})
      .include('models')
      .then('middleware')
      .then('controllers')
      .into(app);
  }

  router(routes) {
    swaggerify(app, routes);
    return this;
  }

  listen(port, callback) {
    if (!port) {
      port = process.env.PORT;
    }
    http.createServer(app).listen(port, () => {
      log.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`);
      if (callback) {
        callback(app);
      }
    });
    return app;
  }

  boot(callback) {
    return this.listen(null, callback);
  }

  shutdown(callback) {
    http.close(callback);
    log.debug(`Shutdown`);
  }
}
module.exports = Server;
