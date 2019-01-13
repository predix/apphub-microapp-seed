const fs = require('fs-extra');
const path = require('path');
const carsJson = fs.readJSONSync(path.resolve(__dirname, './cars.json'));
const request = require('request');

console.log(carsJson);

const newJson = carsJson.map((car) => {
  let c = car;
  c._id = `car-${car.id}`;
  delete c.id;
  c.docType = 'car';
  return c;
});

function saveDoc(d) {
  request({
    method: 'POST',
    url: 'http://localhost:9000/api/db',
    body: d,
    json: true
  }, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
  });
}

newJson.map(saveDoc)

fs.writeJSONSync(path.resolve(__dirname, './new-cars.json'), newJson);
