
exports.command = function () {
  const logoutBtn = '[href="/logout"]';
  const logoutMenu = '.pxh-login__name';
  return this
    .waitForElementVisible(logoutMenu, 15000)
    .click(logoutMenu)
    .waitForElementVisible(logoutBtn, 15000)
    .click(logoutBtn);
};
