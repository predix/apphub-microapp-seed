const Base = require('lowdb/adapters/Base');
const redis = require('redis-node');
const log = require('./logger')('RedisAdapter');
class RedisAdapter extends Base {
  constructor(source, defaultValue) {
    super(source, defaultValue);
    const { ENABLE_REDIS_STORE, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB, NODE_ENV} = process.env;
    
    this.source = source;
    this.defaultValue = defaultValue;
    
    log.debug('RedisAdapter', 'constructor', source, defaultValue);
    
    try{
      if (ENABLE_REDIS_STORE === 'true' && REDIS_HOST && REDIS_PORT && REDIS_PASSWORD){
        log.debug('REDIS_HOST', REDIS_HOST);
        log.debug('REDIS_PORT', REDIS_PORT);
        log.debug('REDIS_PASSWORD', REDIS_PASSWORD);
         this.client = redis.createClient({
           host: REDIS_HOST,
           post: REDIS_PORT,
           password: REDIS_PASSWORD
         }); 
       } 
       
       if(NODE_ENV === 'test'){
         this.client = require('redis-mock').createClient();
       }
       
       if(!this.client){
         this.client = redis.createClient();
       }
   
       this.client.on('connected', (e) => {
         log.debug('connected', e);
       });
       this.client.on('reconnecting', (e) => {
         log.debug('reconnecting', e);
       });
       this.client.on('reconnected', (e) => {
         log.debug('reconnected', e);
       });
       this.client.on('noconnection', (e) => {
         log.debug('noconnection', e);
       });
       this.client.on('connection error', (e) => {
         log.debug('connection error', e);
       });
       this.client.on('disconnected', (e) => {
         log.debug('disconnected', e);
       });
       
       this.client.select(REDIS_DB || 0);
    } catch(err){
      console.log('Redis Database Error', err);
    }
  }

  read(){
    const data = this.client.get(this.source);
    log.debug('read', data);
    if(data){
      return this.deserialize(data);
    } else {
      //this.write(this.defaultValue);
      return this.defaultValue;
    }
  }
  
  write(data){
    return new Promise((resolve, reject) => {
      log.debug('write', data);
      this.client.set(this.source, this.serialize(data), (err, status) => {
        if(err){
          log.debug('write.error', err);

          reject(err);
        }
        log.debug('write.success', status);
        resolve(status);
      });
    })
  }

  _serialize(o){
    return JSON.stringify(o);
  }
  
  _deserialize(o){
    return JSON.parse(o);
  }
  
  close(){
    this.client.close();
  }
}
module.exports = RedisAdapter;
