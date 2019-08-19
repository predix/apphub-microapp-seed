const swStats = require('swagger-stats');
const SwaggerParser = require('swagger-parser');
const specLocation = require('./swagger.json');

const { ELASTIC_SEARCH_URL, SWAGGER_STATS_USERNAME, SWAGGER_STATS_PASSWORD } = process.env;

module.exports = function(app) {
  // http://swaggerstats.io/docs.html#configuration
  const swaggerStatsOptions = {
    swaggerSpec: null,
    elasticsearch: ELASTIC_SEARCH_URL || null,
    authentication: SWAGGER_STATS_USERNAME || false,
    onAuthenticate: (req, username, password) => {
      if (SWAGGER_STATS_USERNAME === username && SWAGGER_STATS_PASSWORD === password) {
        return true;
      }
      return false;
    }
  };

  SwaggerParser.validate(specLocation, function(err, api) {
    if (err) {
      console.error(err);
    } else {
      console.log(`API name: ${api.info.title}, Version: ${api.info.version}`);
      swaggerStatsOptions.swaggerSpec = api;
      app.use(swStats.getMiddleware(swaggerStatsOptions));
    }
  });
};
