'use strict';
exports.command = function(username, password){

  const TIMEOUT = 20000;
  if(!username){
    username = this.globals.username;
  }
  if(!password){
    password = this.globals.password;
  }
  console.log('login', username, password);
  //this.url(this.globals.baseUrl + '/login');

  return this.waitForElementVisible('form', TIMEOUT)
    .waitForElementVisible('form [name="username"]', TIMEOUT)
    .setValue('form [name="username"]', username)
    .waitForElementVisible('form [name="password"]', TIMEOUT)
    .setValue('form [name="password"]', password)
    .waitForElementVisible('.island-button', TIMEOUT)
    .click('.island-button');
};
