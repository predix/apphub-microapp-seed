const express = require('express');
const os = require('os');
const cluster = require('cluster');
const http = require('http');
const log = require('./logger')('server');

/**
 * @class Server
 * @description Common server that handles launching http server.
 */
class Server {
  constructor(a, config) {
    this.routes = [];
    this.log = log;
    this.config = config;
    if (a) {
      this.app = a;
    } else {
      this.app = express();
    }
    this.http = http.createServer(this.app);
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
      this.http = http.createServer(this.app);
      this.http.listen(port, process.env.HOST || null, () => {
        console.log(
          `🌎 Running on ${this.http.address().port}, Open up http://${this.http.address()
            .address || 'localhost'}:${this.http.address().port} in your browser.`
        );
      });
      this.http.on('listening', () => {
        this.log.debug(
          `💯 Worker ${process.pid} started in ${process.env.NODE_ENV || 'development'}`
        );
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
    this.routes = this.routes.concat(routes);
    return this;
  }

  boot(callback) {
    this.log.debug('boot');
    return this.listen(null, callback);
  }

  shutdown(callback) {
    this.log.debug('shutdown');
    try {
      this.http.close();
      callback(null);
    } catch (e) {
      log.error('shutdown', e);
      callback(e, null);
      process.exit(1);
    }
  }

  getHTTPServer() {
    this.log.debug('getHTTPServer');
    return this.http;
  }
}
module.exports = Server;
