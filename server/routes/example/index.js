const myFirstMiddleware = function myFirstMiddleware(req, res, next) {
  console.log('myFirstMiddleware', req.url);
  next();
};

const mySecondMiddleware = function mySecondMiddleware(req, res, next) {
  console.log('mySecondMiddleware', req.url);
  next();
};

module.exports = {
  '/': {
    post: function createSomething(req, res, next) {
      res.status(200).send({data: req.body});
    }
  },
  '/my/path/to/:something': {
    get: function getSomething(req, res, next) {
      res.status(200).send({
        params: req.params
      });
    },

    // you can also use an array if you need to use middlewares
    post: [myFirstMiddleware, mySecondMiddleware, function createSomethingElse(req, res, next) {
      res.status(200).send({data: req.body});
    }]
  }
};
