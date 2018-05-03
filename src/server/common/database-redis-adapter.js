const Base = require('lowdb/adapters/Base');
const log = require('./logger')('RedisAdapter');

const {
  ENABLE_REDIS_STORE, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB, NODE_ENV
} = process.env;

const Redis = NODE_ENV === 'test' ? require('ioredis-mock') : require('ioredis');

let redisClient = null;

class RedisAdapter extends Base {
  constructor(source, defaultValue) {
    super(source, defaultValue);

    this.log = log;
    this.source = source;
    this.defaultValue = defaultValue;

    log.debug('RedisAdapter', source, defaultValue);

    try {
      if (!ENABLE_REDIS_STORE) {
        return;
      }
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
      log.error('RedistAdapter.error', err);
      throw err;
    }
  }

  async read() {
    try {
      const data = await redisClient.get(this.source);
      return data ? this.deserialize(data) : this.defaultValue;
    } catch (err) {
      log.error('read.error', err);
      throw err;
    }
  }

  async write(data) {
    try {
      const result = await redisClient.set(this.source, this.serialize(data));
      this.log.debug('write', result);
      return data;
    } catch (err) {
      log.error('write.error', err);
      throw err;
    }
  }

  static getRedisClient() {
    return redisClient;
  }

  close() {
    this.log.debug('close');
    redisClient.disconnect();
  }
}

module.exports = RedisAdapter;
