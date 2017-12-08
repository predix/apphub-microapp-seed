'use strict';
const path = require('path');

module.exports = {
  '@tags': [
    'app', 'sanity'
  ],
  before: function(browser) {
    console.log('Globals', browser.globals);
    browser
      .url(`${browser.globals.baseUrl}/login`)
      .waitForElementVisible('body', browser.globals.timeout)
      .loginUser();
  },
  after: function(browser) {
    browser.end();
  },
  'should load app and have title': function(browser) {
    const app = browser.page.app();
    app
      .navigate()
      .waitForElementVisible('body', browser.globals.timeout)
      .expect.element('@header').text.to.equal('Micro-App Seed');
  }
};
