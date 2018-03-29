const path = require('path');
const Database = require('../../common/database');
const RedisAdapter = require('../../common/database-redis-adapter');
var adapter, db;

const DB_NAME = process.env.DB_NAME || 'apphub-microapp-seed';


//const log = require('../../common/logger')('controllers/api');
/**
 * @description API Controller
 */
class ApiController {
  constructor(){
    const {ENABLE_REDIS_STORE, NODE_ENV, API_DATABASE_ADAPTER} = process.env;
    if(ENABLE_REDIS_STORE === 'true' && NODE_ENV !== 'test'){
      db = new Database(DB_NAME, {user: {}, docs: []}, 'redis');
    } else {
      try {
        db = new Database(DB_NAME, {user: {}, docs: []}, API_DATABASE_ADAPTER); 
      } catch(err){
        console.log('Falling back to in-memory data store');
        db = new Database(DB_NAME, {user: {}, docs: []}, 'memory');
      }
    }
  }

  index(req, res){
    res.status(200).send({
      name: req.t('APPLICATION_NAME'),
      message: 'Welcome to the API'
    });
  }

  info(req, res, next){
    db.info()
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).json(err));
  }
  
  allDocs(req, res, next){
    db.allDocs(req.query)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).json(err));
  }

  get(req, res, next){
    db.get(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).json(err));
  }

  put(req, res, next){
    db.put(req.body)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  }

  post(req, res, next){
    db.post(req.body)
      .then(resp => res.status(201).json(resp))
      .catch(err => res.status(400).send(err));
  }

  bulkDocs(req, res, next){
    db.bulkDocs(req.body)
      .then(resp => res.status(200).json(resp))
      .catch(err => res.status(400).send(err));
  }

  delete(req, res, next){
    db
      .remove(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  }
}

module.exports = new ApiController();
