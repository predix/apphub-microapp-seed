const pkg = require('../../../package.json');
const log = require('./logger')('database');
const uuid = require('uuid');
const path = require('path');
const homeOrTmp = require('home-or-tmp');
const low = require('lowdb');
const fs = require('fs-extra');

const FileSync = require('lowdb/adapters/FileAsync');
const Memory = require('lowdb/adapters/Memory');
const RedisAdapter = require('./database-redis-adapter');
const CustomAdapter = require('./database-custom-adapter');


var db;
var instance = null;
var initialized = false;
/**
 * Simple mock / local file system db
 * https://github.com/typicode/lowdb#usage
 */
class Database {
  constructor(name, defaults, adapter) {
    if (!defaults) {
      defaults = {
        user: {},
        docs: []
      };
    }

    this.options = {
      adapter: adapter,
      db_name: name,
      instance_start_time: Date.now()
    };
    this.name = name;
    this.defaults = defaults;
    this.adapter = adapter;

  }

  connect() {
    return new Promise((resolve, reject) => {
      if (typeof (this.adapter) === 'string') {
        try {
          console.log('Database - ', 'loading adapter', adapter);
          if (adapter === 'redis') {
            this.adapter = new RedisAdapter(name, defaults);
            low(this.adapter).then(redisdb => {
              this.db = redisdb;
              resolve(this);
            }).catch(reject);
          }
        } catch (e) {
          console.log('Error with adapter', e);
          reject(e);
        }
      }
    });

  }

  static async getInstance(name, defaults, adapter) {
    if (!instance) {
      instance = new Database(name, defaults, adapter);
      if (adapter === 'memory') {
        instance.adapter = new CustomAdapter(name, defaults);
        db = await low(instance.adapter);;
      } else if (adapter === 'file') {
        const dbPath = path.resolve(homeOrTmp, `.${name}.json`);
        log.debug('dbPath', dbPath);
        try {
          fs.ensureFileSync(dbPath);
          instance.dbPath = dbPath;
          instance.adapter = new FileSync(dbPath);
          db = await low(instance.adapter);
          db.defaults(defaults).write();
        } catch (err) {
          console.log('Error creating file store', err);
          throw err;
        }
      } else {
        throw new Error('Provide an adapter. memory, file, redis');
      }
    }
    instance.db = db;
    return instance;
  }

  info() {
    this.options.doc_count = this.db.get('docs').size().value();
    return Promise.resolve(this.options);
  }

  /**
   * Get all documents in store.
   * @param {Object} params Object of values to filter by.
   */
  async allDocs(params) {
    try {
      let docs;
      if (params) {
        docs = db.get('docs').filter(params).value();
      } else {
        docs = db.get('docs').value();
      }
      return docs;
    } catch (err) {
      return err;
    }
  }

  /**
   * 
   * @param {String} id The id of the document
   */
  async get(id) {
    log.debug('get', id);
    if (!id) {
      throw new Error(`get - must provide _id`);
    }
    let doc = db.get('docs').find({
      _id: id
    }).value();
    if (!doc) {
      throw new Error(`get - doc with id ${id} not found`);
    }
    return doc;
  }
  /**
   * Add document to store
   * @param {Object} doc The document
   */
  post(doc) {
    return new Promise((resolve, reject) => {
      if (!doc) {
        reject({
          error: `must provide doc`
        });
      } else {
        if (!doc._id) {
          doc._id = `doc-${uuid()}`;
        }
        if (!doc.created_at) {
          doc.created_at = new Date().toString();
        }
        db.get('docs')
          .push(doc)
          .write();
        resolve({
          ok: true,
          doc: doc
        });
      }
    });
  }

  put(doc) {
    return new Promise((resolve, reject) => {
      if (!doc._id) {
        reject({
          error: `must provide _id`
        });
      }
      /*
      let existingDoc = db.get('docs').find({
        id: doc.id
      }).value();
      */
      if (doc) {
        doc.updated_at = new Date().toString();
        db.get('docs')
          .find({
            _id: doc._id
          })
          .assign(doc)
          .write();
        resolve({
          ok: true,
          doc: doc
        });
      } else {
        reject({
          error: `${id} not found`
        });
      }
    });
  }

  async remove(id) {
    if (!id) {
      throw new Error('Must provide _id');
    }
    try {
      let doc = await this.get(id);
      db.get('docs').remove({
        _id: id
      }).write();
      return {
        ok: true
      };
    } catch (err) {
      throw new Error(`Document ${id} not found`);
    }
  }

  bulkDocs(docs) {
    return new Promise((resolve, reject) => {
      var out = [];
      for (let index = 0; index < docs.length; index++) {
        const doc = docs[index];
        if (doc._id) {
          if (doc._deleted) {
            this.remove(doc._id).then(r => out.push(r));
          } else {
            this.put(doc).then(r => out.push(r));
          }
        } else {
          this.post(doc).then(r => out.push(r));
        }
      }
      resolve(out);
      //Promise.all(out).then(resolve, reject);
    })
  }
}
module.exports = Database;
