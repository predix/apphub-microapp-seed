const fs = require('fs');
const path = require('path');
const log = require('../../common/logger')('nav');
const defaultNavFilePath = path.resolve(__dirname, '../../nav.json');
var nav = {};
var navMap = {};

const mapToArray = (m)=>{
  var out = [], k;
  for(k in m){
    out.push(m[k]);
  }
  return out;
};

class NavModel {
  constructor(navFilePath){
    this.navFilePath = navFilePath || defaultNavFilePath;
  }
  read(){
    return new Promise((resolve, reject) =>{
      try {
        var tmp = JSON.parse(fs.readFileSync(this.navFilePath, 'utf8'));
        for (var i = 0; i < tmp.length; i++) {
          navMap[tmp[i].path] = tmp[i];
        }
        log.debug('navMap', navMap);
        resolve(tmp);
      } catch (e) {
        log.error('readNavFile', 'error', e);
        reject(e);
      }
    });
  }
  update(item){
    return this.read().then((nav) => {
      navMap[item.path] = item;
      log.debug('updated nav', navMap);
      fs.writeFileSync(this.navFilePath, JSON.stringify(mapToArray(navMap)), 'utf8');
      return navMap;
    });
  }
  get(){
    return this.read();
  }
  toArray(){
    return mapToArray(navMap);
  }
}
module.exports = NavModel;
