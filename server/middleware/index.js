module.exports = function(app){
  require('./localize')(app);
  require('./app')(app);
  require('./auth')(app);
  require('./api')(app);
  require('./nav')(app);

  require('./swagger')(app);
  return app;
};
