/**
 * @description API Controller
 */
module.exports = {
  index(req, res) {
    res.status(200).send({
      name: req.t('APPLICATION_NAME'),
      message: 'Welcome to the API'
    });
  },

  info(req, res, next) {
    req.app.locals.db.info(req.query)
      .then(resp => res.status(200).send(resp))
      .catch(next);
  },

  allDocs(req, res, next) {
    req.app.locals.db.allDocs(req.query)
      .then(resp => res.status(200).send(resp))
      .catch(next);
  },

  get(req, res) {
    req.app.locals.db.get(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  },

  put(req, res) {
    req.app.locals.db.put(req.body)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  },

  post(req, res, next) {
    req.app.locals.db.post(req.body)
      .then(resp => res.status(201).json(resp))
      .catch(next);
  },

  bulkDocs(req, res, next) {
    req.app.locals.db.bulkDocs(req.body)
      .then(resp => res.status(200).json(resp))
      .catch(next);
  },

  delete(req, res) {
    req.app.locals.db
      .remove(req.params.id)
      .then(resp => res.status(200).send(resp))
      .catch(err => res.status(404).send(err));
  }
};
