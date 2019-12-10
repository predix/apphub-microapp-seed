require("./common/env")();

const uuidv4 = require('uuid/v4');

const port = process.env.PORT || 9000;
const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");

const Server = require("./common/server");
const routes = require("./routes");
const middleware = require("./middleware");

const server = new Server().router();
const app = server.getExpressApp();

let currentApp = app;

app.use((req, res, next) => {
  req._id = uuidv4();
  res.set('x-b3-traceid', req.get('x-b3-traceid') || req._id);
  console.log(`Started request handling, request id: ${req._id}`);
  next();
});

// TODO: I hate having to bring in web components and Polymer
app.use(
  "/bower_components",
  serveStatic(path.join(__dirname, "../../bower_components"))
);

// TODO: 1. Load middleware
middleware(app, server.getHTTPServer());

// TODO: 2. Load routes
routes(app, server.getHTTPServer());

const serveStaticOptions = {
  _setHeaders: (res, path) => {
    console.log('set headers', path, res.headers);
  }
};

require("./middleware/swagger")(app, routes);
require("./middleware/swagger/stats")(app);

/* istanbul ignore next */

if (process.env.NODE_ENV === 'development') {
  app.use('/assets', express.static(path.resolve(__dirname, '../assets'), serveStaticOptions));
  require('./common/dev')(app);

  if (module.hot) {
    console.log("Hot module on server...");
    module.hot.accept("./common/server", () => {
      server.getHTTPServer().removeEventListener("request", currentApp);
      server.getHTTPServer().on("request", app);
      currentApp = app;
    });
  }
}

if (require.main === module) {
  server.listen(port);
} else {
  module.exports = server;
}
