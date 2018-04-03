'use strict';
var assert = require('assert');
var expect = require('chai').expect;
var helpers = require('../../helpers');
var requireHelper = helpers.require;
var DB = requireHelper('server/common/database');
var tempFile = require('path').resolve(__dirname, '../../.temp-db');

var low = require('lowdb');
var Base = require('lowdb/adapters/Base');
var RedisAdapter = requireHelper('server/common/database-redis-adapter');


describe('DB', function () {
  this.timeout(10000);

  var db, instance, mockDoc;
  
  describe('REDIS adapter', () => {
    var redisdb;
    before( async() => {
      db = await low(new RedisAdapter(`test-redisdb`, {
        posts: []
      }));
      return db;
    });

    it('should create doc', (done) => {
      expect(db).to.not.be.null;
      db.get('posts')
        .push({
          id: 1,
          title: 'lowdb-redis-adapter',
          created: new Date().toString()
        })
        .push({ id: 2, title: 'lowdb is awesome'})
        .push({ id: 3, title: 'lowdb is fast'})
        .push({ id: 4, title: 'lowdb is cool!'})
        .write();
        done();
    });

    it('should check doc', (done) => {
      expect(db.has('posts').value()).to.not.be.null;
      done();
    });

    it('should get title', (done) => {
      let title = db.get('posts[0].title').value();
      expect(title).to.not.be.null;
      done();
    });

    it('should update doc', (done) => {
      db.get('posts').find({id: 2}).assign({tag: 'test', updated: new Date().toString()}).write();
      expect(db.get('posts[0].tag').value()).to.not.be.null;
      done();
    });
    
    it('should remove doc', (done) => {
      db.get('posts').remove({ id: 1 }).write();
      expect(!db.get('posts').find({id: 1}).value());
      done();
    });

  });

  
  

});
