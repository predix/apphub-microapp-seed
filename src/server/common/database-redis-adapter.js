const Base = require('lowdb/adapters/Base');
const log = require('./logger')('RedisAdapter');
const Redis = process.env.NODE_ENV === 'test' ? require('ioredis-mock') : require('ioredis');

var redisClient = null;

class RedisAdapter extends Base {
  constructor(source, defaultValue) {
    super(source, defaultValue);
    const { ENABLE_REDIS_STORE, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB, NODE_ENV} = process.env;
  
    this.source = source;
    this.defaultValue = defaultValue;
    
    try {
      redisClient = new Redis(
        REDIS_PORT || 6379, 
        REDIS_HOST || 'localhost', {
          password: REDIS_PASSWORD,
          db: REDIS_DB || 0,
          lazyConnect: false,
          reconnectOnError: false
        }
      );
    } catch (err) {
      console.log('RedistAdapter.error', err);
      throw err;
    }
  }

  async read(){
    try {
      const data = await redisClient.get(this.source);  
      return data ? this.deserialize(data) : this.defaultValue;
    } catch(err){
      console.error('read.error', err);
      throw err;
    }
  }

  async write(data){
    try {
      const result = await redisClient.set(this.source, this.serialize(data));
      return data;
    } catch(err){
      console.error('write.error', err);
      throw err;
    }
  }

  static getRedisClient(){
    return redisClient;
  }

  close(){
    redisClient.disconnect();
  }
}
 
module.exports = RedisAdapter;
