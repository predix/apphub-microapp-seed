const middleware = require('swagger-express-middleware');
const specLocation = require('./swagger.json');

/* istanbul ignore file */
module.exports = function(app, routes) {
  return middleware(specLocation, app, (err, mw) => {
    app.enable('case sensitive routing');
    app.enable('strict routing');

    app.use(mw.metadata());
    app.use(
      mw.files(
        {
          caseSensitive: false,
          strict: false
        },
        {
          useBasePath: true,
          apiPath: process.env.SWAGGER_API_SPEC
        }
      )
    );

    app.use(
      mw.parseRequest({
        cookie: {
          secret: process.env.SESSION_SECRET
        },
        json: {
          limit: process.env.REQUEST_LIMIT
        }
      })
    );

    app.use(mw.CORS(), mw.validateRequest());

    if (routes) {
      routes(app);
    }
  });
};
