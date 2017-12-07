const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

/**
 * Simple mock / local file system db
 * https://github.com/typicode/lowdb#usage
 */
class Database {
  constructor(name, defaults){
    if(!defaults){
      defaults = {user: {}, nav: []};
    }
    this.adapter = new FileSync(name || path.resolve(__dirname, '../../db.json'));
    this.db = low(this.adapter);

    this.db.defaults(defaults).write();
    return this.db;
  }
}
module.exports = Database;
