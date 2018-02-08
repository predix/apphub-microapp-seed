const Base = require('lowdb/adapters/Base');
const redis = require('redis-node');

class RedisAdapter extends Base {
  constructor(source, {defaultValue} = {}) {
    super(source, {defaultValue});
    this.source = source;
    this.defaultValue = defaultValue;
    this.client = redis.createClient();
    this.client.select(0);
  }

  read(){
    const data = this.client.get(this.source);
    if(data){
      return this.deserialize(data);
    } else {
      this.client.set(this.source, this.serialize(this.defaultValue));
      return this.defaultValue;
    }
  }

  write(data){
    console.log('write', data);
    this.client.set(this.source, this.serialize(data));
  }
  close(){
    this.client.close();
  }
}
module.exports = RedisAdapter;
