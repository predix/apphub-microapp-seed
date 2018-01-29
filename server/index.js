require('./common/env');
const express = require('express');
const routesList = require('express-api-routes-list');
const path = require('path');
const config = require('../config');
const Server = require('./common/server');
const log = require('./common/logger')('server');
const isDeveloping = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 9000;
const routes = require('./routes');
const middleware = require('./middleware');

const server = new Server(null, config).router();
const app = server.getExpressApp();

// TODO: Load middleware first
middleware(app);

// TODO: Load routes second
routes(app);

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  require('./common/dev-setup')(app);
}

if (require.main === module) {
  console.log(routesList(app).toString());
  server.listen(port, () => {
    console.log(`Running on port ${port}`)
  });
} else {
  module.exports = server;
}
