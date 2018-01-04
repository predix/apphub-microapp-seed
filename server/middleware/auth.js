const passportConfig = require('../common/passport');
const userInfo = require('../common/user-info');

/**
 * This middleware will handle the authentication of the application. (If enabled);
 * @param app {Express} The application instance that will be attached to.
 * @returns {*}
 */
module.exports = (app) => {
  const log = app.middleware.application.getLogger('middleware:auth');


  if (process.env.UAA_URL) {
    log.debug('setting up oauth with', process.env.UAA_URL);

    const passport = passportConfig.configurePassportStrategy();
    app.use(passport.initialize());
    app.use(passport.session());


    app.get('/login', passport.authenticate('predix', {'scope': ''}), function(req, res) {
      // The request will be redirected to Predix UAA for authentication
    });

    //logout route
    app.get('/logout', (req, res) => {
      log.debug('Redirecting to', req.originalUrl);
    	req.session.destroy();
    	req.logout();
      passportConfig.reset();
      res.redirect(`${process.env.UAA_URL}/logout?redirect=${req.originalUrl}`);
    });

    //callback route redirects to secure route after login
    app.get(['/callback', '/oauth/callback'], passport.authenticate('predix', {failureRedirect: '/'}), (req, res) => {
      log.debug('Redirecting to secure route...');
      res.redirect('/');
    });

    // route to fetch user info from UAA for use in the browser
    app.get('/userinfo', userInfo(process.env.UAA_URL), (req, res) => {
      res.send(req.user);
    });

  } else {
    log.info('Setting up mock oauth routes');

    app.get([
      '/login',
      '/logout',
      '/callback'
    ], (req, res) => {
      log.debug('authentication not configured');
      res.redirect('/');
    });
  }

  return this;
};
