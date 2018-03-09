const path = require('path');
const express = require('express');
const proxy = require('express-request-proxy');
const routesList = require('express-api-routes-list');
const os = require('os');
const cluster = require('cluster');
const log = require('./logger')('server');
/* Issue finding dependencies for   "swagger-express-middleware": "^1.0.0-alpha.12" */
//const swaggerify = require('./swagger');
var http;
 

/** 
 * Server
 */
class Server {
  constructor(a, config) {
    if (a) {
      this.app = a;
    } else {
      this.app = express()
    }
  }

  getExpressApp() {
    return this.app;
  }

  router(routes) {
    //swaggerify(this.app, routes);
    return this;
  }

  listen(port, callback) {
    if (!port) {
      port = process.env.PORT || 9000;
    }

    if (cluster.isMaster && process.env.ENABLE_CLUSTER_MODE) {
      const cpuCount = process.env.NUMBER_OF_WORKERS || os.cpus().length;
      for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
      }
      cluster.on('exit', function (worker) {
        log.debug(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      http = require('http').createServer(this.app);
      http.listen(port, () => {
        console.log(`===> 🌎 Listening on port ${port}. Open up http://0.0.0.0:${port}/ in your browser.`);
        log.debug(`===> 💯 Worker ${process.pid} started in ${process.env.NODE_ENV || 'development'}`);
        if (callback) {
          callback(this.app);
        }
      });
    }
    return this;
  }

  boot(callback) {
    log.debug(`boot`);
    return this.listen(null, callback);
  }

  shutdown(callback) {
    log.debug(`shutdown`);
    try {
      http.close(callback);
    } catch (e) {
      log.error('shutdown', e);
      process.exit(1);
    }

  }
}
module.exports = Server;
