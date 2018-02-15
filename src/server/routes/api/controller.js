const path = require('path');
const Database = require('../../common/database');
const RedisAdapter = require('../../common/database-redis-adapter');
var adapter = null;

if(process.env.REDIS_HOST){
  adapter = RedisAdapter;
}

const db = new Database(path.resolve(__dirname, '.db.json'), {user: {}, docs: []}, adapter);

//const log = require('../../common/logger')('controllers/api');
/**
 * @description API Controller
 */
class ApiController {
  constructor(){
  }

  index(req, res){
    res.status(200).send({
      name: req.t('APPLICATION_NAME'),
      message: 'Welcome to the API'
    });
  }

  all(req, res, next){
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

  delete(req, res, next){
    db
      .remove(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  }
}

module.exports = new ApiController();
