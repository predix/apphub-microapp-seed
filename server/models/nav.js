const fs = require('fs');
const path = require('path');
const log = require('../common/logger')('models/nav');

/**
 * nav model
 */
module.exports = function(app) {
  const navFilePath = path.resolve(__dirname, '../nav.json');

  var navMap = {};

  const readNavFile = () => {
    return new Promise((resolve, reject) =>{
      try {
        var tmp = JSON.parse(fs.readFileSync(navFilePath, 'utf8'));
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
  };

  const mapToArray = (m)=>{
    var out = [], k;
    for(k in m){
      out.push(m[k]);
    }
    return out;
  };

  const update = (item) => {
    return readNavFile().then((nav) => {
      navMap[item.path] = item;
      log.debug('updated nav', navMap);
      fs.writeFileSync(navFilePath, JSON.stringify(mapToArray(navMap)), 'utf8');
      return navMap;
    });
  };


  this.mapToArray = mapToArray;
  this.read = readNavFile;
  this.update = update;
  this.get = () => {
    return readNavFile();
  };

  this.toArray = () =>{
    return mapToArray(navMap);
  };

  return this;

};
