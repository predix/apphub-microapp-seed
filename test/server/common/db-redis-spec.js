const low = require('lowdb');
const helpers = require('../../helpers');
const { expect } = require('chai');

const RedisAdapter = helpers.require('server/common/database-redis-adapter');

describe('RedisAdapter', function () {
  this.timeout(10000);
  let db;

  before(async () => {
    db = await low(new RedisAdapter('test-redisdb', {
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
      .push({ id: 2, title: 'lowdb is awesome' })
      .push({ id: 3, title: 'lowdb is fast' })
      .push({ id: 4, title: 'lowdb is cool!' })
      .write();
    done();
  });

  it('should check doc', (done) => {
    expect(db.has('posts').value()).to.not.be.null;
    done();
  });

  it('should get title', (done) => {
    const title = db.get('posts[0].title').value();
    expect(title).to.not.be.null;
    done();
  });

  it('should update doc', (done) => {
    db.get('posts').find({ id: 2 }).assign({ tag: 'test', updated: new Date().toString() }).write();
    expect(db.get('posts[0].tag').value()).to.not.be.null;
    done();
  });

  it('should remove doc', (done) => {
    db.get('posts').remove({ id: 1 }).write();
    expect(!db.get('posts').find({ id: 1 }).value());
    done();
  });
});
