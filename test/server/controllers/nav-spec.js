'use strict';
const request = require('supertest');
const helpers = require('../../helpers');
const requireHelper = helpers.require;

//const locales = requireHelper('server/locales');

describe('/nav', () => {
  var app;

  before(function (done) {
    app = requireHelper('server');
    done();
  });

  after(function () {
    //app.shutdown();
  });

  it('GET - /api/nav responds successfully', (done) => {
    request(app)
      .get('/api/nav')
      .expect(200, done);
  });

  it('PUT - /api/nav responds successfully', (done) => {
    request(app)
      .put('/api/nav')
      .send({
        "id": "settings",
        "label": "Settings",
        "path": "/settings"
      })
      .expect(200, done);
  });

  it('GET - /api/nav - responds successfully with nav service request', (done) => {
    request(app)
      .get('/api/nav')
      .expect(200, done);
  });

});
