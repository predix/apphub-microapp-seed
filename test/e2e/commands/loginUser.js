exports.command = function(username, password) {
  const TIMEOUT = 20000;
  let u = username;
  let p = password;

  if (!username) {
    u = this.globals.username;
  }
  if (!password) {
    p = this.globals.password;
  }
  // this.url(this.globals.baseUrl + '/login')
  return this.waitForElementVisible('form', TIMEOUT)
    .waitForElementVisible('form [name="username"]', TIMEOUT)
    .setValue('form [name="username"]', u)
    .waitForElementVisible('form [name="password"]', TIMEOUT)
    .setValue('form [name="password"]', p)
    .waitForElementVisible('.island-button', TIMEOUT)
    .click('.island-button');
};
