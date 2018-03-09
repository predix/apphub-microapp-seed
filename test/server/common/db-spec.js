'use strict';
 const assert = require('assert');
var expect = require('chai').expect;
var helpers = require('../../helpers');
var requireHelper = helpers.require;
var DB = requireHelper('server/common/database');
var tempFile = require('path').resolve(__dirname, '../../.temp-db');

var Base = require('lowdb/adapters/Base');
var RedisAdapter = requireHelper('server/common/database-redis-adapter');



/**
 * Custom Redist Lowdb Adapter
 

var redis = require('redis-node');
var low = require('lowdb');
class RedisTestAdapter extends Base {
  constructor(source, defaultValue) {
    super(source, defaultValue);
    console.log('RedisTestAdapter', source, defaultValue);
    this.source = source;
    this.defaultValue = defaultValue;
    this.client = redis.createClient();
    this.client.select(0);
  }

  read(){
    const data = this.client.get(this.source);
    if(data){
      return this.deserialize(data);
    } else {
      this.client.set(this.source, this.serialize(this.defaultValue));
      return this.defaultValue;
    }
  }

  write(data){
    this.client.set(this.source, this.serialize(data));
  }

  close(){
    this.client.close();
  }
}


xdescribe('REDIS adapter', () => {
  xit('should create doc', () =>{
    const redisdb = low(new RedisTestAdapter('test-redisdb', {}));
    expect(redisdb).to.not.be.null;

    redisdb.defaults({ posts: [] }).write();
  
    redisdb.get('posts')
      .push({ title: 'lowdb' })
      .push({ title: 'lowdb-redis-adapter' })
      .write();

  });
});

*/

//TODO - Use temp inmemory db for testing.

describe('DB', () => {
  var db, instance, mockDoc;

  before(() => {
    //db = DB.getInstance(tempFile, {docs: [], posts: []});
    db = new DB(tempFile, {docs: []});
    //db = new DB(tempFile, {docs: []}, new RedisTestAdapter('test', {docs: []}));
  });

  after((done) => {
    //require('fs').unlink(tempFile, done);
    //db.adapter.close();
    done();
  });

  it('be defined', () => {
    expect(DB).to.not.be.null;
  });


  /**
   * Run all crud tests
   * @param {*} newInstance 
   */
  function runCRUDTests(newInstance) {
    if (newInstance) {
      console.log('Setting db to new instance');
      db = newInstance;
    }

    it('should return instance', () => {
      expect(db).to.not.be.null;
    });

    it('post - should create doc and add ID', (done) => {
      db.post({
        title: 'Test Comment',
        type: 'comment'
      }).then((resp) => {
        expect(resp).to.not.be.null;
        //expect(resp._id).to.be.defined;
        done();
      }).catch(done);
    });

    it('post - should create doc', (done) => {
      db.post({
        title: 'Test Post',
        type: 'post'
      }).then((resp) => {
        mockDoc = resp.doc;
        expect(mockDoc).to.not.be.null;
        expect(mockDoc._id).to.be.defined;
        done();
      }).catch(done);
    });

    it('post - should reject if no doc passed', (done) => {
      db.post().then((resp) => {
        done();
      }).catch((err) => {
        expect(err).to.not.be.null;
        done();
      });
    });

    it('put - should update doc and resolve on success', (done) => {
      mockDoc.updated = Date.now();
      db.put(mockDoc).then((resp) => {
        mockDoc = resp.doc;
        expect(mockDoc).to.not.be.null;
        expect(mockDoc.updated).to.be.defined;
        done();
      }).catch(done);
    });

    it('put - should reject if doc was not found', (done) => {
      db.put({
        _id: 'some-id'
      }).then((resp) => {
        done();
      }).catch((err) => {
        expect(err).to.not.be.null;
        done();
      });
    });

    it('get - should reject if no id passed', (done) => {
      db.get().then((resp) => {
        done();
      }).catch((err) => {
        expect(err).to.not.be.null;
        done();
      });
    });

    it('get - should resolve on success', (done) => {
      db.post(mockDoc).then((r)=>{
        mockDoc = r.doc;
        db.get(mockDoc._id).then((doc) => {
          expect(doc).to.not.be.null;
          expect(doc._id).to.be.defined;
          expect(doc.title).to.equal('Test Post');
          done();
        }).catch(done);
      });
      
    });

    it('allDocs - should return all docs', (done) => {
      db.allDocs().then((docs) => {
        expect(docs).to.not.be.null;
        done();
      }).catch(done);
    });

    it('allDocs - should return all docs filtered', (done) => {
      db.allDocs({
        type: 'comment'
      }).then((docs) => {
        expect(docs).to.not.be.null;
        //expect(docs[0].title).to.equal('Test Comment');
        done();
      }).catch(done);
    });
  
    it('remove - should resolve on success', (done) => {
      db.post({name: 'remove me'}).then((resp) => {
        assert(resp.ok);
        assert(resp.doc, 'returns doc');
        db.remove(resp.doc._id)
          .then(r => {
            assert(r.ok);
            done();
          }).catch(done);
      }).catch(done);
    });
  
  
  }

  describe('CRUD operations (In Memory)', () => {
    
    runCRUDTests();
  });

  xdescribe('CRUD operations (Filestore)', () => {
    db = new DB(tempFile, {
      docs: []
    });
    runCRUDTests(db);
  });

  if (process.env.TEST_REDIS_STORE) {
    xdescribe('CRUD operations (Redis)', () => {
      db = new DB('apphub-microapp-seed-db', {
        docs: []
      }, 'redis');
      runCRUDTests(db);
    });
  }

  describe('lowdb instance', () => {
    before(() => {
      instance = DB.getInstance(tempFile).db;
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

    xit('should push item into defaults', function () {
      instance.get('docs')
        .push({
          id: 1,
          title: 'lowdb is awesome'
        })
        .push({
          id: 2,
          title: 'lowdb is fast'
        })
        .write();
      var doc = instance.get('docs').find({
        id: 1
      });
      console.log(doc);
      expect(instance.get('docs').find({
        id: 1
      }).value().id).to.equal(1);
    });
  });

});
