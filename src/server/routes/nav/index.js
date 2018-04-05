const controller = require('./controller');
module.exports = {
  '/': {
    get: controller.get
    /*,
    put: controller.put,
    post: controller.post,
    delete: controller.delete*/
  }
};
