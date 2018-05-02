const log = require('../../common/logger')('controllers/api');
/**
 * @description API Controller
 */
class ApiController {
  constructor() {
    this.log = log;
  }

  index(req, res) {
    this.log('index');
    res.status(200).send({
      name: req.t('APPLICATION_NAME'),
      message: 'Welcome to the API'
    });
  }

  info(req, res, next) {
    this.log('info', req.query);
    req.app.locals.db.info(req.query)
      .then(resp => res.status(200).send(resp))
      .catch(next);
  }

  allDocs(req, res, next) {
    this.log('allDocs', req.query);
    req.app.locals.db.allDocs(req.query)
      .then(resp => res.status(200).send(resp))
      .catch(next);
  }

  get(req, res, next) {
    this.log('get', req.params);
    req.app.locals.db.get(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(next);
  }

  put(req, res, next) {
    this.log('put', req.body);
    req.app.locals.db.put(req.body)
      .then(resp => res.status(200).send(resp))
      .catch(next);
  }

  post(req, res, next) {
    this.log('post', req.body);
    req.app.locals.db.post(req.body)
      .then(resp => res.status(201).json(resp))
      .catch(next);
  }

  bulkDocs(req, res, next) {
    this.log('bulkDocs', req.body);
    req.app.locals.db.bulkDocs(req.body)
      .then(resp => res.status(200).json(resp))
      .catch(next);
  }

  delete(req, res, next) {
    this.log('delete', req.params);
    req.app.locals.db
      .remove(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(next);
  }
}

module.exports = new ApiController();
