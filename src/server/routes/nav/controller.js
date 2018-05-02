const NavModel = require('./model');

class NavController {
  constructor() {
    this.model = new NavModel();
  }
  get(req, res, next) {
    this.model.read()
      .then(n => res.status(200).send(n))
      .catch(next);
  }
  /*
  put(req, res, next){
    nav
      .update(req.body)
      .then(r => res.status(200).send(r))
      .catch(next);
  }
  post(req, res, next){
    if(req.body){
      nav
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
  } */
}

module.exports = new NavController();
