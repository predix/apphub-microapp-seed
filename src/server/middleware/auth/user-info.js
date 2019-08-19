const request = require('request');
const log = require('../../common/logger')('auth/user-info');

const getUserInfo = (accessToken, uaaURL, callback) => {
  /* istanbul ignore next */
  log.debug('getUserInfo', uaaURL);
  const options = {
    method: 'GET',
    url: `${uaaURL}/userinfo`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  request(options, (err, response, body) => {
    if (!err) {
      log.debug('response', body);
      const userDetails = JSON.parse(body);
      callback(userDetails);
    } else {
      log.error('ERROR fetching client token:', err, response);
    }
  });
};

module.exports = (uaaURL) => (req, res, next) => {
  log.debug('getUserInfo', req.session);
  if (req.user && !req.user.details) {
    getUserInfo(req.session.passport.user.currentUser.access_token, uaaURL, (userDetails) => {
      log.debug('getUserInfo', userDetails);
      req.user.details = userDetails;
      next();
    });
  } else {
    next();
  }
};
