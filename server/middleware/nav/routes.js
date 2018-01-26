const controller = require('./controller');
const log = require('../../common/logger')('controllers:nav');

module.exports = function(app){

  app
    .route(['/nav','/api/nav'])
    .all(controller.all)
    .get(controller.get)
    .put(controller.put)
    .post(controller.post)
    .delete(controller.delete);

  return app;
};