const path = require('path');
const log = require('../../common/logger')('nav');
const nav = require('./nav');

class NavModel {
  constructor(newNav){
    this.nav = newNav || nav;
  }
  read(){
    return Promise.resolve(this.nav);
  }
  update(item){
    this.nav[item.path] = item;
    return Promise.resolve(this.nav);
  }
  get(){
    return this.read();
  }
}
module.exports = NavModel;
