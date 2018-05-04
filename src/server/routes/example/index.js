const bodyParser = require('body-parser');

const myFirstMiddleware = function myFirstMiddleware(req, res, next) {
  // console.log('myFirstMiddleware', req.url);
  next();
};

const mySecondMiddleware = function mySecondMiddleware(req, res, next) {
  // console.log('mySecondMiddleware', req.url);
  next();
};

/**
 * Example Router/Controller
 * This controller will test various things, such as query params
 * Posting data.
 * Putting data.
 *
 */
module.exports = {

  '/timeout/:time': {
    get: (req, res) => {
      setTimeout(function () {
        res.status(200).send({
          headers: req.headers,
          body: req.body,
          query: req.query
        });
      }, req.params.time || 1000);
    },
    post: (req, res) => {
      setTimeout(function () {
        res.status(200).send({
          headers: req.headers,
          body: req.body,
          query: req.query
        });
      }, req.params.time || 1000);
    }
  },
  '/500': {
    get: (req, res) => {
      res.status(500).send({
        headers: req.headers,
        body: req.body,
        query: req.query
      });
    },
    post: (req, res) => {
      res.status(500).send({
        headers: req.headers,
        body: req.body,
        query: req.query
      });
    }
  },
  '/getCookies': {
    get: (req, res) => {
      res.status(200).send({
        cookies: req.headers.cookie
      });
    }
  },
  '/setCookie/:cName/:cValue': {
    get: (req, res) => {
      const customCookie = `${req.params.cName}=${req.params.cValue};Path=/`;
      res.set({
        'Set-Cookie': customCookie
      })
        .status(200)
        .send({
          cookies: req.headers.cookie
        });
    }
  },
  '/:id?': {
    get: (req, res) => {
      res.status(200).send({
        headers: req.headers,
        query: req.query
      });
    },
    put: [bodyParser.json(), (req, res) => {
      res.status(200).send({
        headers: req.headers,
        body: req.body
      });
    }],
    post: [bodyParser.json(), (req, res) => {
      res.status(201).send({
        headers: req.headers,
        body: req.body
      });
    }]
  },
  '/my/path/to/:something': {
    get: function getSomething(req, res) {
      res.status(200).send({
        params: req.params
      });
    },

    // you can also use an array if you need to use middlewares
    post: [myFirstMiddleware, mySecondMiddleware, function createSomethingElse(req, res) {
      res.status(200).send({ data: req.body });
    }]
  }
};
