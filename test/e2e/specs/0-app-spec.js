module.exports = {
  '@tags': ['app', 'sanity'],
  before(browser) {
    browser
      .url(`${browser.globals.baseUrl}/login`)
      .waitForElementVisible('body', browser.globals.timeout)
      .loginUser();
  },
  after(browser) {
    browser.end();
  },
  'should load app and have title': function(browser) {
    const app = browser.page.app();
    app
      .navigate()
      .waitForElementVisible('body', browser.globals.timeout)
      .expect.element('@header')
      .text.to.equal('Micro-App Seed');
  }
};
