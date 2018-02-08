'use strict';
const expect = require('chai').expect;
const helpers = require('../../helpers');
const requireHelper = helpers.require;
const DB = requireHelper('server/common/database');
const tempFile = require('path').resolve(__dirname, '../../.temp-db.json');


/**
 * Custom Redist Lowdb Adapter
 */
const Base = require('lowdb/adapters/Base');
const redis = require('redis-node');

class RedisAdapter extends Base {
  constructor(source, {defaultValue} = {}) {
    super(source, {defaultValue});
    console.log('CustomAdapter', source, defaultValue);
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

//TODO - Use temp inmemory db for testing.




describe('DB', () => {
  var db, instance;

  before(() =>{
    //db = DB.getInstance(tempFile, {docs: [], posts: []});
   // db = new DB(tempFile, {docs: []}, CustomAdapter);
    //db = new DB(tempFile, {docs: []}, RedisAdapter);
    db = new DB(tempFile, {docs: []});
  });

  after((done) => {
    //require('fs').unlink(tempFile, done);
    //db.adapter.close();
    done();
  });

  it('be defined', ()=>{
    expect(DB).to.not.be.null;
  });

  it('should return instance', ()=>{
    expect(db).to.not.be.null;
  });

  describe('db methods', ()=> {
    var mockDoc;

    it('post - should create doc and add ID', (done) => {
      db.post({
        title: 'Test Comment',
        type: 'comment'
      }).then((resp) => {
        expect(resp).to.not.be.null;
        expect(resp.id).to.be.defined;
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
        expect(mockDoc.id).to.be.defined;
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
      mockDoc.updated = Date.now();
      db.put({
        id: 'some-id'
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

    it('get - should get doc', (done) => {
      db.get(mockDoc.id).then((doc) => {
        mockDoc = doc;
        expect(doc).to.not.be.null;
        expect(doc.id).to.be.defined;
        expect(doc.title).to.equal('Test Post');
        done();
      }).catch(done);
    });

    it('allDocs - should return all docs', (done) => {
      db.allDocs().then((docs) => {
        expect(docs).to.not.be.null;
        done();
      }).catch(done);
    });

    it('allDocs - should return all docs filtered', (done) => {
      db.allDocs({type: 'comment'}).then((docs) => {
        expect(docs).to.not.be.null;
        expect(docs[0].title).to.equal('Test Comment');
        done();
      }).catch(done);
    });

  });

  describe('lowdb instance', ()=> {
    before(() =>{
      instance = DB.getInstance(tempFile).db;
    });

    it('should return instance', ()=> {
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
        .push({ id: 1, title: 'lowdb is awesome'})
        .push({ id: 2, title: 'lowdb is fast'})
        .write();
      var doc = instance.get('docs').find({id: 1});
      console.log(doc);
      expect(instance.get('docs').find({id: 1}).value().id).to.equal(1);
    });
  });

});
