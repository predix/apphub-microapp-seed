const request = require('request');

const BASE_URL = 'http://localhost:9002';
const count = 50;

// Set config defaults when creating the instance
const r = request.defaults({
  json: true,
  baseUrl: BASE_URL
});
console.log(count, r);
