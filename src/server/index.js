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
  server.listen(port, () => {
    console.log(routesList(app).toString());
  });
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
