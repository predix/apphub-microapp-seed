'use strict';
const expect = require('chai').expect;
const helpers = require('../../helpers');
const pkg = require('../../../package.json');
const requireHelper = helpers.require;
const Logger = requireHelper('server/common/logger');

describe('Logger', () =>{
  var log;
  before(() =>{
    log = new Logger('spec');
  });

  it('be defined', ()=>{
    expect(Logger).to.not.be.null;
  });

  it('should return instance', ()=>{
    expect(log).to.not.be.null;
  });

  it('should return subject', function () {
    let expected = `${pkg.name}:INFO:spec`;
    let actual = log.getSubject('info');
    expect(actual).to.equal(expected);
  });

  it('should log info', function () {
    log.info('test info');
  });
  it('should log debug', function () {
    log.debug('test');
  });
  it('should log error', function () {
    log.error('test');
  });
  it('should log warn', function () {
    log.warn('test');
  });
  it('should log always', function () {
    log.always('test');
  });
});
