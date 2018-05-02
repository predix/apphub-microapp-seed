/**
 * This is the entry point for the app,
 * It will start the express server no mater what.
 * But in development it will load the middleware.
 */
// const express = require('express');
const express = require('express');

const app = express();
const serveStatic = require('serve-static');
const routesList = require('express-api-routes-list');
// const app = express();
const server = require('./server');

const port = process.env.PORT || 9000;

// TODO - Load dev middleware in develop
/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  require('./server/common/dev')(app);
}

app.use(server.getExpressApp());
app.listen(port, () => {
  console.log(routesList(app).toString());
  console.log(`Running on port ${port}`);
});

