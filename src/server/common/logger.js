const debug = require('debug');
const ns = require('../../../package.json').name;

module.exports = function (n) {
  /**
   * Logger class enables a nicely formatted console logger.
   * Output is enabled when setting the environment variable `DEBUG`
   *
   * @example
   * require('./logger')('some-controller');
   * @example
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
  return new Logger(n);
};
