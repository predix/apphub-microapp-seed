const fs = require('fs');
const path = require('path');
const log = require('../logger')('models/nav');
/**
 * nav model
 */
module.exports = function(app) {

  const navFilePath = path.resolve(__dirname, '../nav.json');

  var navMap = {};

  const readNavFile = () => {
    try {
      var tmp = JSON.parse(fs.readFileSync(navFilePath, 'utf8'));
      for (var i = 0; i < tmp.length; i++) {
        navMap[tmp[i].path] = tmp[i];
      }
      log.debug('navMap', navMap);
      return tmp;
    } catch (e) {
      log.error('readNavFile', 'error', e);
    }
  };

  const mapToArray = (m)=>{
    var out = [];
    for(var k in m){
      out.push(m[k]);
    }
    return out;
  };

  const update = (item) => {
    readNavFile();
    navMap[item.path] = item;
    log.debug('updated nav', navMap);
    fs.writeFileSync(navFilePath, JSON.stringify(mapToArray(navMap)), 'utf8');
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
