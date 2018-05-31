const express = require('express');
const os = require('os');
const cluster = require('cluster');
const log = require('./logger')('server');
/* Issue finding dependencies for   "swagger-express-middleware": "^1.0.0-alpha.12" */
// const swaggerify = require('./swagger');
let http;

/**
 * @class Server
 * @description Common server that handles launching http server.
 */
class Server {
  constructor(a, config) {
    this.log = log;
    this.config = config;
    if (a) {
      this.app = a;
    } else {
      this.app = express();
    }
  }

  listen(port, callback) {
    if (cluster.isMaster && process.env.ENABLE_CLUSTER_MODE === 'true') {
      const cpuCount = process.env.NUMBER_OF_WORKERS || os.cpus().length;
      for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        this.log.debug(`Worker ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      http = require('http').createServer(this.app);
      http.listen(port, process.env.HOST || null, () => {
        console.log(`🌎 Running on port ${http.address().port}. Open up http://${http.address().address}:${http.address().port} in your browser.`);
      });
      http.on('listening', () => {
        this.log.debug(`💯 Worker ${process.pid} started in ${process.env.NODE_ENV || 'development'}`);
        if (callback) {
          callback(null, this.app);
        }
      });
    }
    return this;
  }

  getExpressApp() {
    return this.app;
  }

  router(routes) {
    this.routes = routes;
    // swaggerify(this.app, routes);
    return this;
  }

  boot(callback) {
    this.log.debug('boot');
    return this.listen(null, callback);
  }

  shutdown(callback) {
    this.log.debug('shutdown');
    try {
      http.close();
      callback(null);
    } catch (e) {
      log.error('shutdown', e);
      callback(e, null);
      process.exit(1);
    }
  }

  getHTTPServer() {
    this.log.debug('getHTTPServer');
    return http;
  }
}
module.exports = Server;
