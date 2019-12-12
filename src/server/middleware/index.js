module.exports = function(app, server) {
  require('./localize')(app);
  require('./app')(app);
  require('./auth')(app);
  require('./event-stream')(app, server);
  require('./web-sockets')(app, server);
  return app;
};
