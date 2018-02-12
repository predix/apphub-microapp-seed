const log = require('./logger')('database');
const uuid = require('uuid');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Memory = require('lowdb/adapters/Memory');
const homeOrTmp = require('home-or-tmp');
const pkg = require('../../../package.json');
const LocalStorage = require('node-localstorage').LocalStorage;

var db;
var instance;
/**
 * Simple mock / local file system db
 * https://github.com/typicode/lowdb#usage
 */
class Database {
  constructor(name, defaults, Adapter){
    if(!defaults){
      defaults = {user: {}, nav: [{
        "label": "Microapp Seed",
        "icon": "fa-home",
        "path": "/microapp1"
      }]};
    }
    const dbPath = path.resolve(homeOrTmp, `./.${pkg.name}-db.json`);
    console.log('Database', dbPath);
   // const adapter = new LocalStorage(name);
    this.adapter = (Adapter ? new Adapter(name, {defaultValue: defaults}) : new Memory(name || dbPath));

    db = low(this.adapter);
    try {
      db.defaults(defaults).write();
    } catch (e) {
      log.error('error writing defaults', e);
    }

    //lowdb instance
    this.db = db;

  }

  static getInstance(name){
    if(!instance){
      instance = new Database(name);
    }
    return instance;
  }

  allDocs(params){
    return new Promise((resolve, reject) =>{
      var docs;
      if(params){
        docs = db.get('docs').filter(params).value();
      } else {
        docs = db.get('docs').value();
      }
      resolve(docs);
    });
  }

  get(id){
    return new Promise((resolve, reject) => {
      if(!id){
        reject({error: `must provide id`});
      }
      let doc = db.get('docs').find({id: id}).value();
      if(!doc){
        reject({error: `${id} not found`});
      }
      resolve(doc);
    });
  }

  post(doc){
    return new Promise((resolve, reject) => {
      if(!doc){
        reject({error: `must provide doc`});
      } else {
        if(!doc.id){
          doc.id = `doc-${uuid()}`;
        }
        db.get('docs')
          .push(doc)
          .write();
        resolve({ok: true, doc: doc});
      }
    });
  }

  put(doc){
    return new Promise((resolve, reject) => {
      if(!doc.id){
        reject({error: `must provide id`});
      }
      let existingDoc = db.get('docs').find({ id: doc.id }).value();
      if(doc){
        db.get('docs')
          .find({ id: doc.id })
          .assign(doc)
          .write();
        resolve({ok: true, doc: doc});
      } else {
        reject({error: `${id} not found`});
      }
    });
  }

  remove(id){
    return new Promise((resolve, reject) => {
      this.get(id).then((doc) => {
        db.get('docs').remove({id: id}).write();
        resolve({ok: true});
      }).catch(reject);
    });
  }
}
module.exports = Database;
