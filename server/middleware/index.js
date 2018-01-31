module.exports = function(app){
  require('./localize')(app);
  require('./app')(app);
  require('./auth')(app);


  // TODO: Enable swagger
  //require('./swagger')(app);
  return app;
};
