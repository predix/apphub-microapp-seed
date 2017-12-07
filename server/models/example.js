module.exports = (app) => {

  // you would use a db ;)
  var rows = [
    {id: 1, name: 'Sam'},
    {id: 2, name: 'Terry'}
  ];

  this.find = function() {
    return rows;
  };

  this.findByName = function(id) {
    for (var u in rows) {
      if (rows[u].id === id) {
        return rows[u];
      }
    }
  };

  return this;
};
