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
const log = require('./logger')('app');
const port = config.port;


const app = express();






// TODO: Express Middleware
app.use(cookieParser());
app.use(Lingo.create({ defaultLanguage: 'en' }, languagesDict).middleware());


// TODO: Express Settings
app.disable('x-powered-by');

if(config.env.production){
  log.debug('Setting production only settings.');
  app.use(serveStatic(path.resolve(__dirname, '..', config.paths.dest)));
}

app.use(serveStatic(path.resolve(__dirname, '..', config.paths.static)));


// TODO: Express Routes
require('./routes')(app);



// ========================================================================
// START THE SERVER
const http = require('http').Server(app);

// Need to let CF set the port if we're deploying there.
const boot = function(cb) {
  log.debug('Boot');
  http.listen(port, function() {
    log.debug(`Started on port ${port}`);
    if (cb) {
      cb();
    }
  });

};

const shutdown = function(cb) {
  http.close(cb);
  log.debug(`Shutdown`);
};



/* istanbul ignore if */
if (require.main === module) {
  boot();
} else {
  app.boot = boot;
  app.shutdown = shutdown;
  app.port = port;
}

module.exports = app;
