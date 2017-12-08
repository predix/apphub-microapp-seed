'use strict';
const expect = require('chai').expect;
const helpers = require('../../helpers');
const requireHelper = helpers.require;
const DB = requireHelper('server/common/database');
const tempFile = require('path').resolve(__dirname, '../../.temp-db.json');

describe('DB', () => {
  var db, instance;

  before(() =>{
    //db = DB.getInstance(tempFile, {docs: [], posts: []});
    db = new DB(tempFile, {docs: []});
  });

  after((done) => {
    require('fs').unlink(tempFile, done);
  });

  it('be defined', ()=>{
    expect(DB).to.not.be.null;
  });

  it('should return instance', ()=>{
    expect(db).to.not.be.null;
  });

  describe('db methods', ()=> {
    var mockDoc;
    it('post - should create doc', (done) => {
      db.post({title: 'test'}).then((resp) => {
        mockDoc = resp.doc;
        expect(mockDoc).to.not.be.null;
        expect(mockDoc.id).to.be.defined;
        done();
      }).catch(done);
    });

    it('put - should update doc', (done) => {
      mockDoc.updated = Date.now();
      db.put(mockDoc).then((resp) => {
        mockDoc = resp.doc;
        expect(mockDoc).to.not.be.null;
        expect(mockDoc.updated).to.be.defined;
        done();
      }).catch(done);
    });

    it('get - should get doc', (done) => {
      db.get(mockDoc.id).then((doc) => {
        mockDoc = doc;
        expect(doc).to.not.be.null;
        expect(doc.id).to.be.defined;
        expect(doc.title).to.equal('test');
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

    it('should push item into defaults', function () {
      instance.get('docs')
        .push({ id: 1, title: 'lowdb is awesome'})
        .push({ id: 2, title: 'lowdb is fast'})
        .write();
      expect(instance.get('docs').find({id: 1}).value().id).to.equal(1);
    });
  });

});
