'use strict';
const request = require('supertest');

//const locales = requireHelper('server/locales');

describe('Nav Middleware', () => {
  var app;

  before(function (done) {
    app = require('../../../server/index').getExpressApp();
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

  it('POST - /api/nav responds successfully', (done) => {
    request(app)
      .post('/api/nav')
      .send({
        "id": "app1",
        "label": "Some App",
        "path": "/some-app"
      })
      .expect(201, done);
  });

  it('GET - /api/nav - responds successfully with nav service request', (done) => {
    request(app)
      .get('/api/nav')
      .expect(200, done);
  });



  it('DELETE - /api/nav - responds successfully with nav service request', (done) => {
    request(app)
      .del('/api/nav')
      .expect(200, done);
  });

});
