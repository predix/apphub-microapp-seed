const log = require('./logger')('database');
const uuid = require('uuid');
const path = require('path');
const homeOrTmp = require('home-or-tmp');
const low = require('lowdb');
const fs = require('fs-extra');

const FileSync = require('lowdb/adapters/FileAsync');
const RedisAdapter = require('./database-redis-adapter');
const CustomAdapter = require('./database-custom-adapter');

let db;
let instance = null;
/**
 * Simple mock / local file system db
 * https://github.com/typicode/lowdb#usage
 */
class Database {
  constructor(name, defaults = {
    user: {},
    docs: []
  }, adapter) {
    this.options = {
      adapter,
      db_name: name,
      instance_start_time: Date.now()
    };
    this.name = name;
    this.defaults = defaults;
    this.adapter = adapter;
    this.log = log;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (typeof (this.adapter) === 'string') {
        try {
          log.debug('Database - ', 'loading adapter', this.adapter);
          if (this.adapter === 'redis') {
            this.adapter = new RedisAdapter(this.name, this.defaults);
            low(this.adapter).then((redisdb) => {
              this.db = redisdb;
              resolve(this);
            }).catch(reject);
          }
        } catch (e) {
          log.error('Error with adapter', e);
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
        db = await low(instance.adapter);
      } else if (adapter === 'redis') {
        instance.adapter = new RedisAdapter(name, defaults);
        db = await low(instance.adapter);
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
          this.log.error('Error creating file store', err);
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

  async allDocs(params) {
    this.log.debug('allDocs', params);
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

  async get(id) {
    this.log.debug('get', id);
    if (!id) {
      throw new Error('get - must provide _id');
    }
    const doc = db.get('docs').find({
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
        reject(new Error('Must provide a doc object!'));
      } else {
        const _doc = doc;
        this.log.debug('post', _doc);
        if (!doc._id) {
          _doc._id = `doc-${uuid()}`;
        }
        if (!doc.created_at) {
          _doc.created_at = new Date().toString();
        }
        db.get('docs').push(_doc).write();
        resolve({
          ok: true,
          doc: _doc
        });
      }
    });
  }

  put(doc) {
    return new Promise((resolve, reject) => {
      if (!doc._id || doc.id) {
        reject(new Error('Must provide an id property!'));
      }
      const _doc = doc;
      const id = doc._id || doc.id;
      _doc.updated_at = new Date().toString();
      this.log.debug('put', _doc);
      /*
      let existingDoc = db.get('docs').find({
        id: doc.id
      }).value();
      */
      if (doc) {
        db.get('docs')
          .find({
            _id: id
          })
          .assign(doc)
          .write();
        resolve({
          ok: true,
          doc
        });
      } else {
        reject(new Error(`${id} not found`));
      }
    });
  }

  async remove(id) {
    if (!id) {
      throw new Error('Must provide _id');
    }
    try {
      const doc = await this.get(id);
      this.log.debug('remove', id, doc);
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
      const out = [];
      try {
        let index = 0;

        for (; index < docs.length; index++) {
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
      } catch (err) {
        reject(err);
      }
    });
  }
}
module.exports = Database;
