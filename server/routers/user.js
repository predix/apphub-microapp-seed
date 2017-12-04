/*!
 * Consign.
 * Autoload your scripts.
 *
 * @author Jarrad Seers <jarrad@seers.me>
 * @license MIT
 */

module.exports = function(app) {

  var user = app.middleware.user;


  app.get('/users', user.getAll);
  app.get('/users/:name', user.getByName);

  return this;

};
