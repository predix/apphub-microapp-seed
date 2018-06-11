const session = require('express-session');
const log = require('./logger')('session');

const {
  SESSION_SECRET,
  SESSION_MAX_AGE,
  COOKIE_NAME,
  ENABLE_REDIS_STORE,
  REDIS_HOST,
  REDIS_DB,
  REDIS_PORT,
  REDIS_PASSWORD,
  NODE_ENV
} = process.env;

const setupSessionStore = () => {
  if (ENABLE_REDIS_STORE || NODE_ENV === 'production') {
    log.debug('setupSessionStore', 'using redis store');
    const RedisStore = require('connect-redis')(session);
    return new RedisStore({
      host: REDIS_HOST,
      post: REDIS_PORT,
      pass: REDIS_PASSWORD,
      db: Number(REDIS_DB) || 0
    });
  }
  log.debug('setupSessionStore', 'using memory store');


  return null;
};

const sessionOptions = {
  store: setupSessionStore(),
  secret: SESSION_SECRET || 'test',

  maxAge: SESSION_MAX_AGE || 30 * 60 * 1000,
  proxy: true,
  resave: true,
  saveUninitialized: false,
  cookie: {
    name: COOKIE_NAME || 'apphub-microapp-seed.cookie',
    secure: NODE_ENV === 'production'
  }
};

module.exports = sessionOptions;
