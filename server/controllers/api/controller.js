const log = require('../../common/logger')('controllers/api');
/**
 * @description API Controller
 */
class ApiController {
  constructor(){
    log.debug('constructor');
  }

  all(req, res, next){
    req.app.models.db.allDocs(req.query)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).json(err));
  }

  get(req, res, next){
    req.app.models.db.get(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).json(err));
  }

  put(req, res, next){
    req.app.models.db.put(req.body)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  }

  post(req, res, next){
    req.app.models.db.post(req.body)
      .then(resp => res.status(201).json(resp))
      .catch(err => res.status(400).send(err));
  }

  delete(req, res, next){
    req.app.models.db
      .remove(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  }
}

module.exports = new ApiController();
