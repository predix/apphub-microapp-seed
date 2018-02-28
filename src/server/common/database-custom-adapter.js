var inMemory = {};
class MyStorage {
  constructor(source, {
    defaultValue = {}
  } = {}) {
    this.source = source;
    this.defaultValue = defaultValue;

    console.log('MyStorage', source, defaultValue);
  }

  read() {
    const data = inMemory[this.source];
    console.log('read', data);
    if(data){
        return this.deserialize(data);
    } else {
        this.write(this.defaultValue);
        return this.defaultValue;
    }
  }
  // Should return nothing or a Promise
  write(data) {
    console.log('write', data);
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
