require('./common/env');

const port = process.env.PORT || 9000;

const express = require('express');
const serveStatic = require('serve-static');
const routesList = require('express-api-routes-list');
const path = require('path');

const Server = require('./common/server');
const log = require('./common/logger')('server');

const routes = require('./routes');
const middleware = require('./middleware');

const server = new Server().router();
const app = server.getExpressApp();

// TODO: I hate having to bring in web components and Polymer
app.use('/bower_components', serveStatic(path.resolve(__dirname, '../../bower_components')));

// TODO: 1. Load middleware
middleware(app);

// TODO: 2. Load routes
routes(app);

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  require('./common/dev')(app);
}


if (require.main === module) {

  const port = process.env.PORT || 9000;
  const cluster = require('cluster');

  // Code to run if we're in the master process
  if (cluster.isMaster && process.env.CLUSTER_MODE) {
    console.log(`Master ${process.pid} is running`);
    const cpuCount = require('os').cpus().length;

    for (let i = 0; i < cpuCount; i += 1) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {

    console.log(routesList(app).toString());
    server.listen(port, function () {
      console.log(`Process ${process.pid} running on ${port}`);
    });
  }

} else {
  module.exports = server;
}

/*
module.exports = function serverRenderer({ clientStats, serverStats, foo }) {
  return (req, res, next) => {
    console.log(req.url);
    next();
  };
};*/
