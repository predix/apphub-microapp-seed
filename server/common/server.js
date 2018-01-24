const path = require('path');
const express = require('express');
const load = require('consign');
const proxy = require('express-request-proxy');
const routesList = require('express-api-routes-list');
const os = require('os');
const http = require('http');
const log = require('./logger')('server');
/* Issue finding dependencies for   "swagger-express-middleware": "^1.0.0-alpha.12" */
//const swaggerify = require('./swagger');

var app = express();

class Server {
  constructor(a, config) {
    if(a){
      app = a;
    }
    this.app = app;

    load({
      verbose: false,
      cwd: path.resolve(__dirname, '../../server')
    })
    .include('models')
    .then('middleware')
    .then('controllers')
    .into(this.app);
  }

  getExpressApp(){
    return this.app;
  }

  router(routes) {
    //swaggerify(this.app, routes);
    return this;
  }

  listen(port, callback) {
    if (!port) {
      port = process.env.PORT;
    }
    http.createServer(this.app).listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'}
      @: ${os.hostname()} on port: ${port}`);
      if (callback) {
        callback(this.app);
      }
    });
    return this;
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
