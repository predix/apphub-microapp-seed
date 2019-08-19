/**
 * This is the entry point for the app,
 * It will start the express server no mater what.
 * But in development it will load the middleware.
 */
const express = require('express');
const morgan = require('morgan');
const routesList = require('express-api-routes-list');

const server = require('./server');
const log = require('./server/common/logger')('app');

const app = express();
const port = process.env.PORT || 9000;

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  require('./server/common/dev')(app);
}

app.use(morgan('dev'));
app.use(server.getExpressApp());
app.listen(port, () => {
  log.debug(routesList(app).toString());
  log.debug(`Running on port ${port}`);
});
