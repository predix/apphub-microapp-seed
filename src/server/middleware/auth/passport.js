const passport = require('passport');
const CloudFoundryStrategy = require('passport-predix-oauth').Strategy;
const OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;
const log = require('../../common/logger')('passport');

module.exports = (function() {
  let cfStrategy;

  const configurePassportStrategy = () => {
    const refreshStrategy = new OAuth2RefreshTokenStrategy({
      refreshWindow: 10,
      userProperty: 'currentUser',
      authenticationURL: '/login',
      callbackParameter: 'callback'
    });

    cfStrategy = new CloudFoundryStrategy(
      {
        clientID: process.env.UAA_CLIENT_ID,
        clientSecret: process.env.UAA_CLIENT_SECRET,
        callbackURL: process.env.UAA_CALLBACK_URL,
        authorizationURL: process.env.UAA_URL,
        tokenURL: process.env.UAA_URL
      },
      refreshStrategy.getOAuth2StrategyCallback()
    );

    /* istanbul ignore next */
    passport.serializeUser(function(user, done) {
      log.debug('serializeUser', user);
      done(null, user);
    });

    /* istanbul ignore next */
    passport.deserializeUser(function(obj, done) {
      log.debug('deserializeUser');
      done(null, obj);
    });

    passport.use('main', refreshStrategy);
    passport.use(cfStrategy);
    refreshStrategy.useOAuth2Strategy(cfStrategy);
    return passport;
  };

  return {
    configurePassportStrategy,
    reset() {
      cfStrategy.reset();
    }
  };
})();
