module.exports = {
  '@tags': ['login', 'sanity'],

  'should login user redirect': function(browser) {
    const login = browser.page.login();
    login
      .navigate()
      .waitForElementVisible('body', 5000)
      .loginUser()
      .waitForElementVisible('.pxh-view-header__title', 15000);
    // .logoutUser();

    browser
      .saveScreenshot(`${browser.globals.screenshotDir}/${browser.currentTest.name}.png`)
      .end();
  }
};
