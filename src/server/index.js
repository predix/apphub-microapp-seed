require('./common/env')();

const port = process.env.PORT || 9000;
const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');

const Server = require('./common/server');
const log = require('./common/logger')('server');
const routes = require('./routes');
const middleware = require('./middleware');

const server = new Server().router();
const app = server.getExpressApp();

let currentApp = app;

// TODO: I hate having to bring in web components and Polymer
app.use('/bower_components', serveStatic(path.join(__dirname, '../../bower_components')));

// TODO: 1. Load middleware
middleware(app);

// TODO: 2. Load routes
routes(app);

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  app.use('/assets', express.static(path.resolve(__dirname, '../assets')));
  require('./common/dev')(app);
}

if (module.hot) {
  log.debug('Hot module on server...');
  module.hot.accept('./common/server', () => {
    server.getHTTPServer().removeEventListener('request', currentApp);
    server.getHTTPServer().on('request', app);
    currentApp = app;
  });
}

if (require.main === module) {
  server.listen(port, () => {
    log.info('Server started...');
  });
} else {
  module.exports = server;
}

/*
TODO - Check if using flag to enable server rendering.
module.exports = function serverRenderer({ clientStats, serverStats, foo }) {
  return (req, res, next) => {
    console.log(req.url);
    next();
  };
}; */
