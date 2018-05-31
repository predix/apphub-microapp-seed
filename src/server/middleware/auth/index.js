const pft = require('predix-fast-token');
const passportConfig = require('./passport');
const userInfo = require('./user-info');
const log = require('../../common/logger')('middleware:auth');
/**
 * This middleware will handle the authentication of the application. (If enabled);
 * @param app {Express} The application instance that will be attached to.
 * @returns {*}
 */
module.exports = function (app) {
  const {
    ENABLE_AUTHENTICATION,
    UAA_URL,
    UAA_CALLBACK_URL,
    UAA_CLIENT_ID,
    UAA_CLIENT_SECRET
  } = process.env;

  if (ENABLE_AUTHENTICATION && UAA_URL && UAA_CLIENT_ID && UAA_CLIENT_SECRET) {
    /* istanbul ignore next */
    log.debug('Setting up oauth with', UAA_URL, UAA_CLIENT_ID, UAA_CALLBACK_URL);

    const passport = passportConfig.configurePassportStrategy();
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login', passport.authenticate('predix', { scope: '' }));
    app.get('/logout', (req, res) => {
      log.debug('Redirecting to', req.originalUrl);
      req.session.destroy();
      req.logout();
      passportConfig.reset();
      res.redirect(`${UAA_URL}/logout?redirect=${req.originalUrl}`);
    });

    app.get(['/callback', '/oauth/callback'], passport.authenticate('predix', { failureRedirect: '/' }), (req, res) => {
      log.debug('Redirecting to secure route...');
      res.redirect('/');
    });

    app.get(['/user/info', '/oauth/user'], userInfo(UAA_URL), (req, res) => {
      log.debug('Redirecting to user info page...');
      res.status(200).send(req.user);
    });

    app.get(['/user/verify', '/oauth/verify'], (req, res, next) => {
      if (req.user && req.user.currentUser) {
        const token = req.user.currentUser.access_token;
        const trustedIssuers = [`${UAA_URL}/oauth/token`];
        pft.verify(token, trustedIssuers).then((decoded) => {
          log.debug('verify', decoded);
          res.send(decoded);
        }).catch(next);
      } else {
        res.redirect('/login');
      }
    });
  } else {
    /* istanbul ignore next */
    log.debug('Setting up mock Authentication routes');

    app.get([
      '/login',
      '/logout',
      '/callback',
      '/userinfo',
      '/user/info',
      '/user/verify',
      '/oauth/user',
      '/oauth/verify'
    ], (req, res) => {
      log.debug('authentication not configured');
      res.redirect('/');
    });
  }

  return this;
};
