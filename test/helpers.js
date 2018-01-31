const path = require('path');

var helpers = {
  require: (p) => {
    return require(path.resolve(__dirname, '../src', p));
  }
};

module.exports = helpers;
