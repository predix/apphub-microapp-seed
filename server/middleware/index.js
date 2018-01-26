module.exports = function(app){
  require('./lingo')(app);
  require('./application')(app);
  require('./auth')(app);
  require('./api')(app);
  require('./nav')(app);
  return app;
};
