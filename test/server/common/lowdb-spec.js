'use strict';
const path = require('path');
const assert = require('assert');
const expect = require('chai').expect;
const helpers = require('../../helpers');
const requireHelper = helpers.require;
const DB = requireHelper('server/common/database');
const CustomAdapter = requireHelper('server/common/database-custom-adapter');
const tempFile = require('path').resolve(__dirname, '../.temp-db.json');
const lowdb = require('lowdb');
const Base = require('lowdb/adapters/Base');
const FileAsyncAdapter = require('lowdb/adapters/FileAsync');
const MemoryAdapter = require('lowdb/adapters/Memory');
var instance;

describe('lowdb', function() {
  this.timeout(30000);  
  describe('Memory Adapter', () => {
    before(() => {
      instance = lowdb(new MemoryAdapter());
      instance
        .defaults({
          posts: [],
          user: {},
          count: 0
        })
        .write()
    });
    it('should return instance', () => {
      expect(instance).to.not.be.null;
    });
    it('should write item', function () {
      instance.set('user.name', 'test-user').write();
      expect(instance.get('user.name').value()).to.equal('test-user');
    });
    it('should read item', function () {
      expect(instance.get('user.name').value()).to.equal('test-user');
    });
  });
 xdescribe('FileAsync Adapter', () => {
    before((done) => {
      lowdb(new FileAsyncAdapter(tempFile)).then(db => {
        instance = db;
        instance
          .defaults({
            posts: [],
            user: {},
            count: 0
          })
          .write().then(r => done(null, r));
      });
    });
    it('should return instance', () => {
      expect(instance).to.not.be.null;
    });
    it('should write item (as promise)', function (done) {
      instance
        .get('posts')
        .push({ id: 1, title: 'lowdb is awesome'})
        .set('user.name', 'test-user').write().then(() =>{
          expect(instance.get('user.name').value()).to.equal('test-user');
          done();
        });
    });
    it('should read item', function (done) {
      expect(instance.get('user.name').value()).to.equal('test-user');
      done();
    });
  });
  describe('CustomAdapter', () => {
    before((done) => {
      lowdb(new CustomAdapter('test')).then(db => {
        instance = db;
        instance
          .defaults({
            posts: [],
            user: {},
            count: 0
          })
          .write().then(r => done(null, r));
      });
    });
    it('should return instance', () => {
      expect(instance).to.not.be.null;
    });
    it('should write item (as promise)', function (done) {
      instance
        //.get('posts')
        .set('user.name', 'test-user')
        .write()
        .then(() =>{
          expect(instance.get('user.name').value()).to.equal('test-user');
          done();
        });
    });
    it('should read item (promise)', function (done) {
      let name = instance.get('user.name').value();
      Promise.resolve(name).then(val => {
        console.log('got value', val);
        expect(val === 'test-user');
        done();
      });
    });
    it('should read item', function (done) {
      expect(instance.get('user.name').value()).to.equal('test-user');
      done();
    });
    it('should check item', function (done) {
      expect(instance.has('posts').value());
      done();
    });
  });
});
