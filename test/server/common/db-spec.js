'use strict';
const expect = require('chai').expect;
const helpers = require('../../helpers');
const requireHelper = helpers.require;
const DB = requireHelper('server/common/db');
const tempFile = require('path').resolve(__dirname, '../../.temp-db.json');

describe('DB', () => {
  var db;

  before(() =>{
    db = new DB(tempFile, {user: {}, posts:[]});
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

  it('should write item', function () {
    db.set('user.name', 'test-user').write();
    expect(db.get('user.name').value()).to.equal('test-user');
  });

  it('should read item', function () {
   // db.set('user.name', 'test-user').write();
    expect(db.get('user.name').value()).to.equal('test-user');
  });

  it('should push item into defaults', function () {
    db.get('posts')
      .push({ id: 1, title: 'lowdb is awesome'})
      .push({ id: 2, title: 'lowdb is fast'})
      .write();
    expect(db.get('posts').find({id: 1}).value().id).to.equal(1);
  });


});
