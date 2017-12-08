const passportConfig = require('../common/passport');
const userInfo = require('../common/user-info');
module.exports = (app) => {
  const log = app.middleware.application.getLogger('middleware/auth');
  log.info('Loaded...');

  if (process.env.UAA_URL) {
    log.info('Setting up oauth');

    const passport = passportConfig.configurePassportStrategy();
    app.use(passport.initialize());
    app.use(passport.session());

    //login route redirect to predix uaa login page
    app.get('/login', passport.authenticate('predix', {'scope': ''}), function(req, res) {
      // The request will be redirected to Predix for authentication, so this
      // function will not be called.
    });

    //logout route
    app.get('/logout', (req, res) => {
      log.debug('originalUrl', req.originalUrl);
    	req.session.destroy();
    	req.logout();
      passportConfig.reset(); //reset auth tokens
      res.redirect(`${process.env.UAA_URL}/logout?redirect=${req.originalUrl}`);
    });

    //callback route redirects to secure route after login
    app.get(['/callback', '/oauth/callback'], passport.authenticate('predix', {failureRedirect: '/'}), (req, res) => {
      log.info('Redirecting to secure route...');
      res.redirect('/');
    });

    // route to fetch user info from UAA for use in the browser
    app.get('/userinfo', userInfo(process.env.UAA_URL), (req, res) => {
      res.send(req.user.details);
    });

  } else {
    log.info('Setting up mock oauth routes');

    app.get([
      '/login', '/logout'
    ], (req, res) => {
      res.redirect('/');
    });
  }

  return this;
};
