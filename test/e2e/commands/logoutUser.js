'use strict';
exports.command = function(){
  var logoutBtn = '[href="/logout"]';
  var logoutMenu = '.pxh-login__name';
  return this
    .waitForElementVisible(logoutMenu, 15000)
    .click(logoutMenu)
    .waitForElementVisible(logoutBtn, 15000)
    .click(logoutBtn);
}
