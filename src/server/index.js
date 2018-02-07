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

// TODO: Load middleware first
middleware(app);

// TODO: Load routes second
routes(app);

if (require.main === module) {
  /*server.listen(port, () => {
    console.log(`Running on port ${port}`);
  });*/
} else {
  
}

module.exports = function serverRenderer({ clientStats, serverStats, foo }) {
  return (req, res, next) => {
    console.log(req.url);
    next();
  };
};