const pkg = require('../../../package.json');
const log = require('./logger')('database');
const uuid = require('uuid');
const path = require('path');
const homeOrTmp = require('home-or-tmp');
const low = require('lowdb');
const fs = require('fs-extra');

const FileSync = require('lowdb/adapters/FileSync');
const Memory = require('lowdb/adapters/Memory');
const RedisAdapter = require('./database-redis-adapter');
const CustomAdapter = require('./database-custom-adapter');


var db;
var instance;
/**
 * Simple mock / local file system db
 * https://github.com/typicode/lowdb#usage
 */
class Database {
  constructor(name, defaults, adapter) {
    if (!defaults) {
      defaults = {
        user: {},
        docs: [],
        nav: [{
          "label": "Microapp Seed",
          "icon": "fa-home",
          "path": "/microapp1"
        }]
      };
    }

    this.options = {
      db_name: name,
      instance_start_time: Date.now()
    };

    if (typeof (adapter) === 'string') {
      this.options.adapter = adapter;
      //console.log('Database', 'loading adapter', adapter);
      if (adapter === 'memory') {
        this.adapter = new CustomAdapter(name, defaults);
      }
      if (adapter === 'redis') {
        this.adapter = new RedisAdapter(name, defaults);
      }
      if (adapter === 'file') {
        const dbPath = path.resolve(homeOrTmp, `.${name}-db.json`);
        console.log('Database', 'dbPath', dbPath);
        try {
          fs.ensureFileSync(dbPath);
          this.dbPath = dbPath;
          this.adapter = new FileSync(dbPath);
        } catch (err) {
          console.log('Error creating file store', err);
        }
      }
    } else {
      this.options.adapter = 'Memory';
      this.adapter = adapter || new Memory();
    }

    db = low(this.adapter);
    try {
      db.defaults(defaults).write();
    } catch (e) {
      log.error('error writing defaults', e);
    }

    //lowdb instance
    this.db = db;
  }

  static getInstance(name) {
    if (!instance) {
      instance = new Database(name);
    }
    return instance;
  }

  info(){
    this.options.doc_count = this.db.get('docs').size().value();
    return Promise.resolve(this.options);
  }

  allDocs(params) {
    return new Promise((resolve, reject) => {
      var docs;
      if (params) {
        docs = db.get('docs').filter(params).value();
      } else {
        docs = db.get('docs').value();
      }
      resolve(docs);
    });
  }

  get(id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        reject({
          error: `must provide id`
        });
      }
      let doc = db.get('docs').find({
        id: id
      }).value();
      if (!doc) {
        reject({
          error: `${id} not found`
        });
      }
      resolve(doc);
    });
  }

  post(doc) {
    return new Promise((resolve, reject) => {
      if (!doc) {
        reject({
          error: `must provide doc`
        });
      } else {
        if (!doc.id) {
          doc.id = `doc-${uuid()}`;
        }
        if(!doc.created_at){
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
      if (!doc.id) {
        reject({
          error: `must provide id`
        });
      }
      let existingDoc = db.get('docs').find({
        id: doc.id
      }).value();
      if (doc) {
        doc.updated_at = new Date().toString();
        db.get('docs')
          .find({
            id: doc.id
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

  remove(id) {
    return new Promise((resolve, reject) => {
      this.get(id).then((doc) => {
        db.get('docs').remove({
          id: id
        }).write();
        resolve({
          ok: true
        });
      }).catch(reject);
    });
  }

  bulkDocs(docs) {
    return new Promise((resolve, reject) => {
      var out = [];
      for (let index = 0; index < docs.length; index++) {
        const doc = docs[index];
        if (doc.id) {
          if(doc._deleted){
            out.push(this.remove(doc.id));
          } else {
            out.push(this.put(doc));
          }
        } else {
          out.push(this.post(doc));
        }
      }

      Promise.all(out).then(resolve, reject);
    })
  }
}
module.exports = Database;
