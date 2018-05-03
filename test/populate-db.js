const request = require('request');

const BASE_URL = 'http://localhost:9002';
const count = 50;

// Set config defaults when creating the instance
const r = request.defaults({
  json: true,
  baseUrl: BASE_URL
});

function sendDoc(doc) {
  return new Promise((resolve, reject) => {
    r({
      url: '/api/db',
      method: 'post',
      body: doc
    }, (err, resp, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
}

request.get({
  url: 'https://demo-api-z4d0ze1wqmqf.runkit.sh',
  json: true,
  qs: {
    count
  }
}, (err, resp, body) => {
  body.data.forEach((doc) => {
    console.log('Sending', doc.post_id);
    sendDoc(doc);
  });
});

