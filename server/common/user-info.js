//custom middleware to get the user information from UAA
//function below hits the UAA endpoint with the access token and fetches user information
const request = require('request');
const log = require('./logger')('user-info');

const getUserInfo = (accessToken, uaaURL, callback) => {
  log.debug('getUserInfo', uaaURL);
  var options = {
    method: 'GET',
    url:  `${uaaURL}/userinfo`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };

  request(options, (err, response, body) => {
    if (!err) {
      log.debug('response', body);
      var userDetails = JSON.parse(body);
      callback(userDetails);
    } else {
      console.error(response.statusCode);
      console.error('ERROR fetching client token: ' + err);
    }
  });
};

module.exports = (uaaURL) => {
  return (req, res, next) => {
    log.debug('getUserInfo', req.session);
    if (req.user && !req.user.details) {
      getUserInfo(req.session.passport.user.currentUser.access_token, uaaURL, function(userDetails) {
        console.log(userDetails);
        req.user.details = userDetails;
        next();
      });
    } else {
      next();
    }
  }
};
