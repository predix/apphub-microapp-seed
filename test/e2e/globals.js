const path = require('path');

const reportsDir = path.resolve(__dirname, '../../reports');
/**
 * Define your e2e globals here.
 */
module.exports = {
  timeout: process.env.TEST_TIMEOUT || 20000,
  baseUrl: process.env.TEST_URL || 'http://localhost:9000',
  username: process.env.TEST_USERNAME || 'demo',
  password: process.env.TEST_PASSWORD || 'P@55W0rd',
  reportsDir,
  screenshotsDir: path.resolve(reportsDir, './screenshots')
};
