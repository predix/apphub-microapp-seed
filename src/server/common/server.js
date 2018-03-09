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
      port = process.env.PORT;
    }

    if (cluster.isMaster && process.env.ENABLE_CLUSTER_MODE) {

      // Count the machine's CPUs
      const cpuCount = process.env.NUMBER_OF_WORKERS || os.cpus().length;
      
      // Create a worker for each CPU
      for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
      }

      // Listen for dying workers
      cluster.on('exit', function (worker) {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      http = require('http').createServer(this.app);
      http.listen(port, () => {
        
        console.log(`===> 🌎 Listening on port ${port}. Open up http://0.0.0.0:${port}/ in your browser.`);
        console.log(`===> 💯 Worker ${process.pid} started in ${process.env.NODE_ENV || 'development'}`);
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
    }

  }
}
module.exports = Server;
