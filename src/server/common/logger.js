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
      if (!this._info) {
        this._info = debug(this.getSubject('INFO'));
      }
      return this._info(...args);
    }
    warn(...args) {
      if (!this._warn) {
        this._warn = debug(this.getSubject('WARN'));
      }
      return this._warn(...args);
    }
    error(...args) {
      if (!this._error) {
        this._error = debug(this.getSubject('ERROR'));
      }
      return this._error(...args);
    }
    debug(...args) {
      if (!this._debug) {
        this._debug = debug(this.getSubject('DEBUG'));
      }
      return this._debug(...args);
    }
    always(...args) {
      if (!this._always) {
        this._always = debug(this.getSubject('ALWAYS'));
      }
      return this._always(...args);
    }
  }
  return new Logger(n);
};
