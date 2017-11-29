'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const cookieParser = require('cookie-parser');
const proxy = require('express-request-proxy');
const Lingo = require('./lingo');
const languagesDict = require('../static/locales');
const config = require('../config');
const app = express();
const http = require('http').Server(app);

//Lingo middleware for internationalization (i18n) purpose
app.use(Lingo.create({
  defaultLanguage: 'en'
}, languagesDict).middleware());

app.disable('x-powered-by');
app.use(cookieParser());

app.use(serveStatic(config.paths.static));

if(config.env.production){
  app.use(serveStatic(config.paths.dest));
}

// ========================================================================
// START THE SERVER
// Need to let CF set the port if we're deploying there.
const port = process.env.PORT || 9000;

const boot = function(cb) {
  console.info('Starting ui-microapp');

  // Listen application request on port
  http.listen(port, function() {
    console.log(`${config.appName} started on port ${port}`);
    if (cb) {
      cb();
    }
  });

  http.on('error', function(err) {
    console.error(err.stack);
  });
};

const shutdown = function(cb) {
  http.close(cb);
  console.log(`${config.appName} shutdown`);
};



require('./routes')(app);
/*
   * Accessing the main module by checking require.main
   * Node.js v5.10.1
   * */
/* istanbul ignore if */
if (require.main === module) {
  boot();
} else {
  console.info('Running ui-microapp as a module');
  app.boot = boot;
  app.shutdown = shutdown;
  app.port = port;
}

module.exports = app;
