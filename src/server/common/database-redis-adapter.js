const Base = require('lowdb/adapters/Base');
const redis = require('redis-node');

class RedisAdapter extends Base {
  constructor(source, {defaultValue} = {}) {
    const {REDIS_HOST, REDIS_PORT, REDIS_PASSWORD} = process.env;
    super(source, {defaultValue});
    this.source = source;
    this.defaultValue = defaultValue;
    if(REDIS_HOST){
      this.client = redis.createClient(REDIS_PORT, REDIS_HOST); 
    } else {
      this.client = redis.createClient();
    }
    
    this.client.on('connected', (e) => {
      console.log('connected');
    });
    this.client.on('disconnected', (e) => {
      console.log('disconnected');
    });
   // this.client.select(0);
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
