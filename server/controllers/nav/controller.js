const log = require('../../common/logger')('controllers/nav');
/**
 * @description API Controller
 */
class NavController {
  constructor(){
    log.debug('constructor');
  }
  all(req, res, next){
    next();
  }
  get(req, res, next){
    req.app.models.nav.read()
      .then(n => res.status(200).send(n))
      .catch(next);
  }
  put(req, res, next){
    req.app.models.nav
      .update(req.body)
      .then(r => res.status(200).send(r))
      .catch(next);
  }
  post(req, res, next){
    if(req.body){
      req.app.models.nav
        .update(req.body)
        .then(r => res.status(201).send(r))
        .catch(next);
    } else {
      res.status(400).send({error:'Must provide a request body'});
    }
  }
  delete(req, res, next){
    res.status(200).json({
      message: 'Removed',
      headers: req.headers
    });
  }
}

module.exports = new NavController();