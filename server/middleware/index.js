module.exports = function(app){
  const Lingo = require('./lingo');
  app.use(Lingo.create({
    defaultLanguage: 'en'
  }, Lingo.locales).middleware());

  require('./application')(app);
  require('./auth')(app);
  require('./api')(app);
  require('./nav')(app);
  return app;
};
