const path = require('path');


const helpers = {
  require: p => require(path.resolve(__dirname, '../src', p)) // eslint-disable-line
};

module.exports = helpers;
