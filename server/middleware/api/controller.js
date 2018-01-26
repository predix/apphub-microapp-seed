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
    req.app.locals.db.allDocs(req.query)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).json(err));
  }

  get(req, res, next){
    req.app.locals.db.get(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).json(err));
  }

  put(req, res, next){
    req.app.locals.db.put(req.body)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  }

  post(req, res, next){
    req.app.locals.db.post(req.body)
      .then(resp => res.status(201).json(resp))
      .catch(err => res.status(400).send(err));
  }

  delete(req, res, next){
    req.app.locals.db
      .remove(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  }
}

module.exports = new ApiController();
