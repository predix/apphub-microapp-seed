module.exports = function(app) {
  require('./localize')(app);
  require('./app')(app);
  require('./auth')(app);
  return app;
};
