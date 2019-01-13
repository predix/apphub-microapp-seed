const swStats = require('swagger-stats');
const SwaggerParser = require('swagger-parser');
const path = require('path');

const specLocation = path.join(__dirname, 'swagger.yaml');

const {
  ELASTIC_SEARCH_URL
} = process.env;

module.exports = function (app) {
  //http://swaggerstats.io/docs.html#configuration
  const swaggerStatsOptions = {
    swaggerSpec: null,
    authentication: false,
    elasticsearch: ELASTIC_SEARCH_URL || null
  };
  SwaggerParser.validate(specLocation, function (err, api) {
    if (err) {
      console.error(err);
    } else {
      console.log("API name: %s, Version: %s", api.info.title, api.info.version);
      swaggerStatsOptions.swaggerSpec = api;

      app.use(swStats.getMiddleware(swaggerStatsOptions));
    }
  });
};
