const path = require('path');
const uuid = require('uuid');
const Database = require('../../common/database');

/**
 * Generic database model
 *
 */
module.exports = function(app) {
  const db = new Database(path.resolve(__dirname, '../../.db.json'), {user: {}, docs: []});
  this.instance = db.instance;
  this.get = db.get;
  this.put = db.put;
  this.post = db.post;
  this.remove = db.remove;
  this.allDocs = db.allDocs;
  return this;
};
