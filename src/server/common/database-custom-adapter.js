
const log = require('./logger')('CustomAdapter');

var inMemory = {};

class MyStorage {
  constructor(source, {
    defaultValue = {}
  } = {}) {
    this.source = source;
    this.defaultValue = defaultValue;

    log.debug('constructor', source, defaultValue);
  }

  read() {
    const data = inMemory[this.source];
    //log.debug('read', data);
    if(data){
       return Promise.resolve(this.deserialize(data));
    } else {
      this.write(this.defaultValue);
       return Promise.resolve(this.defaultValue);
    }
  }
  // Should return nothing or a Promise
  write(data) {
    //log.debug('write', data);
    inMemory[this.source] = this.serialize(data);
    return Promise.resolve(data);
  }

  serialize(o){
      return JSON.stringify(o);
  }
  deserialize(o){
      return JSON.parse(o);
  }
}

module.exports = MyStorage;
