const uuid = require('uuid');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

var db;
var instance;
/**
 * Simple mock / local file system db
 * https://github.com/typicode/lowdb#usage
 */
class Database {
  constructor(name, defaults){
    if(!defaults){
      defaults = {user: {}, nav: []};
    }
    this.adapter = new FileSync(name || path.resolve(__dirname, '../../.db.json'));
    db = low(this.adapter);
    db.defaults(defaults).write();

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
