const controller = require('./controller');
const log = require('../../common/logger')('controllers:api');

/**
 * @description Example middleware
 */
module.exports = {
  '/': {
    get: controller.index
  },
  '/db': {
    get: controller.all,
    post: controller.post
  },
  '/db/:id': {
    get: controller.get,
    put: controller.put,
    delete: controller.delete
  }
};
