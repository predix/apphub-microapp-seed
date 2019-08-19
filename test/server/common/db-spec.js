const path = require('path');
const assert = require('assert');
const lowdb = require('lowdb');
const { expect } = require('chai');
const FileAsyncAdapter = require('lowdb/adapters/FileAsync');
const MemoryAdapter = require('lowdb/adapters/Memory');

const helpers = require('../../helpers');

const DB = helpers.require('server/common/database');
const tempFile = path.resolve(__dirname, '../../.temp-db');

describe('DB', () => {
  let db;
  let instance;
  let mockDoc;

  beforeAll((done) => {
    db = DB.getInstance(
      tempFile,
      {
        docs: []
      },
      'memory'
    );
    done();
  });

  afterAll((done) => {
    // require('fs').unlink(tempFile, done);
    // db.adapter.close();
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
      db = newInstance;
    }

    it('should return instance', () => {
      expect(db).to.not.be.null;
    });

    describe('post', () => {
      it('should create doc and resolve on success', (done) => {
        db.post({
          title: 'Test Comment',
          type: 'comment'
<<<<<<< HEAD
        })
          .then((resp) => {
            expect(resp).to.not.be.null;
            expect(resp._id).to.be.defined;
            done();
          })
          .catch(done);
=======
        }).then((resp) => {
          expect(resp).to.not.be.null;
          expect(resp._id).to.not.be.null;
          done();
        }).catch(done);
>>>>>>> master
      });
      it('should create doc with generated _id and resolve on success', (done) => {
        db.post({
          title: 'Test Post',
          type: 'post'
<<<<<<< HEAD
        })
          .then((resp) => {
            mockDoc = resp.doc;
            expect(mockDoc).to.not.be.null;
            expect(mockDoc._id).to.be.defined;
            done();
          })
          .catch(done);
=======
        }).then((resp) => {
          mockDoc = resp.doc;
          expect(mockDoc).to.not.be.null;
          expect(mockDoc._id).to.not.be.null;
          done();
        }).catch(done);
>>>>>>> master
      });
      it('should reject if no doc passed', (done) => {
        db.post()
          .then((resp) => {
            expect(!resp);
            done();
          })
          .catch((err) => {
            expect(err).to.not.be.null;
            done();
          });
      });
    });

    describe('put', () => {
      it('should update doc and resolve on success', (done) => {
        mockDoc.updated = Date.now();
<<<<<<< HEAD
        db.put(mockDoc)
          .then((resp) => {
            mockDoc = resp.doc;
            expect(mockDoc).to.not.be.null;
            expect(mockDoc.updated).to.be.defined;
            done();
          })
          .catch(done);
=======
        db.put(mockDoc).then((resp) => {
          mockDoc = resp.doc;
          expect(mockDoc).to.not.be.null;
          expect(mockDoc.updated).to.not.be.null;
          done();
        }).catch(done);
>>>>>>> master
      });
      it('should reject if _id not found', (done) => {
        db.put({
          _id: 'some-id'
        })
          .then((resp) => {
            expect(!resp);
            done();
          })
          .catch((err) => {
            expect(err).to.not.be.null;
            done();
          });
      });
      it('should reject if no doc passed', (done) => {
        db.put()
          .then((resp) => {
            expect(!resp);
            done();
          })
          .catch((err) => {
            expect(err).to.not.be.null;
            done();
          });
      });
    });

    describe('get', () => {
      it('should reject if no id passed', (done) => {
        db.get()
          .then((resp) => {
            expect(!resp);
            done();
          })
          .catch((err) => {
            expect(err).to.not.be.null;
            done();
          });
      });
      it('should resolve on success', (done) => {
        db.post(mockDoc).then((r) => {
          mockDoc = r.doc;
<<<<<<< HEAD
          db.get(mockDoc._id)
            .then((doc) => {
              expect(doc).to.not.be.null;
              expect(doc._id).to.be.defined;
              expect(doc.title).to.equal('Test Post');
              done();
            })
            .catch(done);
=======
          db.get(mockDoc._id).then((doc) => {
            expect(doc).to.not.be.null;
            expect(doc._id).to.not.be.null;
            expect(doc.title).to.equal('Test Post');
            done();
          }).catch(done);
>>>>>>> master
        });
      });
    });

    describe('allDocs', () => {
      it('should return all docs', (done) => {
        db.allDocs()
          .then((docs) => {
            expect(docs).to.not.be.null;
            done();
          })
          .catch(done);
      });
      it('should filtered docs', (done) => {
        db.allDocs({
          type: 'comment'
        })
          .then((docs) => {
            expect(docs).to.not.be.null;
            // expect(docs[0].title).to.equal('Test Comment');
            done();
          })
          .catch(done);
      });
    });

    describe('remove', () => {
      it('should resolve on success', (done) => {
        db.post({
          name: 'remove me'
        })
          .then((resp) => {
            assert(resp.ok);
            assert(resp.doc, 'returns doc');
            db.remove(resp.doc._id)
              .then((r) => {
                assert(r.ok);
                done();
              })
              .catch(done);
          })
          .catch(done);
      });
      it('should throw if no id', () => {
        expect(() => {
          db.remove();
        }).to.throw;
      });
    });
  }

  describe('CRUD operations (In Memory)', () => {
    beforeAll(async () => {
      db = await DB.getInstance('test', { posts: [] }, 'memory');
      instance = db;
      return db;
    });
    runCRUDTests(db);
  });

  describe('CRUD operations (Filestore)', () => {
    beforeAll(async () => {
      db = await DB.getInstance('test', { posts: [] }, 'file');
      instance = db;
      return db;
    });
    runCRUDTests(db);
  });

  describe('lowdb', () => {
    describe('Memory Adapter', () => {
      beforeAll(() => {
        instance = lowdb(new MemoryAdapter());
        instance
          .defaults({
            posts: [],
            user: {},
            count: 0
          })
          .write();
      });
      it('should return instance', () => {
        expect(instance).to.not.be.null;
      });
      it('should write item', function() {
        instance.set('user.name', 'test-user').write();
        expect(instance.get('user.name').value()).to.equal('test-user');
      });
      it('should read item', function() {
        expect(instance.get('user.name').value()).to.equal('test-user');
      });
    });

    describe('FileAsync Adapter', function() {
      beforeAll(async () => {
        instance = await lowdb(
          new FileAsyncAdapter(path.resolve(__dirname, '../../../temp-db.json'))
        );
        return instance
          .defaults({
            posts: [],
            user: {},
            count: 0
          })
          .write();
      });
      it('should return instance', () => {
        expect(instance).to.not.be.null;
      });
      it('should write item', function() {
        instance.set('user.name', 'test-user').write();
        expect(instance.get('user.name').value()).to.equal('test-user');
      });
      it('should read item', function() {
        expect(instance.get('user.name').value()).to.equal('test-user');
      });
    });
  });
});
