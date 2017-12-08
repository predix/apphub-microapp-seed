'use strict';
const log = require('./logger')('passport');
const passport = require('passport');
const CloudFoundryStrategy = require('passport-predix-oauth').Strategy;
const OAuth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;

var cfStrategy;

/*********************************************************************
				PASSPORT PREDIX STRATEGY SETUP
**********************************************************************/
function configurePassportStrategy() {

  const refreshStrategy = new OAuth2RefreshTokenStrategy({
    refreshWindow: 10,
    userProperty: 'currentUser',
    authenticationURL: '/login',
    callbackParameter: 'callback'
  });

  cfStrategy = new CloudFoundryStrategy({
    clientID: process.env.UAA_CLIENT_ID,
    clientSecret: process.env.UAA_CLIENT_SECRET,
    callbackURL: process.env.UAA_CALLBACK_URL,
    authorizationURL: process.env.UAA_URL,
    tokenURL: process.env.UAA_URL
  }, refreshStrategy.getOAuth2StrategyCallback()
  /* TODO: implement if needed.
	function(accessToken, refreshToken, profile, done) {
		token = accessToken;
		done(null, profile);
	}*/);

  passport.serializeUser(function(user, done) {
    log.debug('serializeUser', user);
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    log.debug('deserializeUser');
    done(null, obj);
  });

  passport.use('main', refreshStrategy);
  passport.use(cfStrategy);

  refreshStrategy.useOAuth2Strategy(cfStrategy);

  return passport;
}

function reset() {
  cfStrategy.reset();
}

module.exports = {
  configurePassportStrategy: configurePassportStrategy,
  reset: reset
};
