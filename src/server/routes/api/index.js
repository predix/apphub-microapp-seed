const controller = require('./controller');

/**
 * @description Example API Route
 *
 */
module.exports = {
  '/': {
    get: controller.index
  },
  '/db': {
    get: controller.info,
    post: controller.post
  },
  '/db/_all_docs': {
    get: controller.allDocs
  },
  '/db/_bulk_docs': {
    post: controller.bulkDocs
  },
  '/db/:id': {
    get: controller.get,
    put: controller.put,
    delete: controller.delete
  }
};
