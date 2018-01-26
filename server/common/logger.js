const debug = require('debug');
const ns = require('../../package.json').name;
/**
 * Logger class enables a nicely formatted console logger.
 * Output is enabled when setting the environment variable `DEBUG`
 *
 * @example
 * require('./logger')('some-controller');
 * @example
 *
 * DEBUG=apphub:*:INFO
 * > apphub:usage:INFO this is info +0ms
 *
 * DEBUG=apphub:*:ERROR
 * > apphub:usage:ERROR this is error +2ms
 *
 * DEBUG=apphub:*:WARN
 * > apphub:usage:WARN this is warn +0ms
 *
 * DEBUG=apphub:*:DEBUG
 * > apphub:usage:DEBUG this is debug +0ms
 *
 * DEBUG=apphub:*:ALWAYS
 * > apphub:usage:ALWAYS this is always +0ms
 *
 * DEBUG=apphub:*
 * > All components at all levels are logged.
 *
 * @example
 * process.env.DEBUG='apphub:INFO:*';
 * var log = new Logger('usage');
 * log.info('this is info');
 * log.error('this is error');
 * log.warn('this is warn');
 * log.debug('this is debug');
 * log.always('this is always');
 */
module.exports = function(name) {

  const LOG_LEVELS = {
    ERROR: 'ERROR',
    ALWAYS: 'ALWAYS',
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN'
  };

  const LOG_LEVEL = process.env.LOG_LEVEL || LOG_LEVELS.INFO;

  class Logger {
    constructor(name) {
      this.name = name;
    }
    getSubject(level) {
      if (level) {
        return `${ns}:${level.toUpperCase()}:${this.name}`;
      }
      return `${ns}:${this.name}`;
    }
    info(...args) {
      return debug(this.getSubject('info'))(...args);
    }
    warn(...args) {
      return debug(this.getSubject('warn'))(...args);
    }
    error(...args) {
      return debug(this.getSubject('error'))(...args);
    }
    debug(...args) {
      return debug(this.getSubject('debug'))(...args);
    }
    always(...args) {
      return debug(this.getSubject('always'))(...args);
    }
  }

  return new Logger(name);
};
