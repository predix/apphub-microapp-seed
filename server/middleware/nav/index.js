const routes = require('./routes');
const nav = require('./nav');
module.exports = function(app){
  nav(app);
  routes(app);
};
