const path = require('path');
const DB = require('../common/db');

/**
 * Generic database model
 *
 */
module.exports = (app) => {

  var db = new DB(path.resolve(__dirname, '../../.db.json'), {user: {}, docs: []});

  this.instance = db;
  this.set = db.set;
  this.get = db.get;
  this.read = db.read;
  this.write = db.write;
  return this;
};
