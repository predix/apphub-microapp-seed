
const Base = require('lowdb/adapters/Base');
const log = require('./logger')('CustomAdapter');

let store = {};

class CustomAdapter extends Base{
  constructor(source = 'in-memory', defaultValue = {}) {
    super(source, defaultValue);
    this.source = source;
    this.defaultValue = defaultValue;
    log.debug('constructor', source, defaultValue);
  }
  read() {
    const data = store[this.source];
    if(data){
      Promise.resolve(this.deserialize(data));
    } else {
      return this.write(this.defaultValue);
    }
  }
  write(data) {
    store[this.source] = this.serialize(data);
    return Promise.resolve(data);
  }
}

module.exports = CustomAdapter;
