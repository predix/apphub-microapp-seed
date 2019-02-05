const Base = require('lowdb/adapters/Base');
const log = require('./logger')('CustomAdapter');

const store = {};

class CustomAdapter extends Base {
  constructor(source = 'in-memory', defaultValue = {}) {
    super(source, defaultValue);
    this.source = source;
    this.defaultValue = defaultValue;
    log.debug('constructor', source, defaultValue);
  }

  read() {
    const data = store[this.source];
    log.debug('read', data);
    if (data) {
      return Promise.resolve(this.deserialize(data));
    }
    return this.write(this.defaultValue);
  }

  write(data) {
    log.debug('write', data);
    store[this.source] = this.serialize(data);
    return Promise.resolve(data);
  }
}

module.exports = CustomAdapter;
