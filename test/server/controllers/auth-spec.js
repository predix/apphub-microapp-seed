'use strict';
const request = require('supertest');
const helpers = require('../../helpers');
const requireHelper = helpers.require;

//const locales = requireHelper('server/locales');

describe('/login', () => {
  var app;

  before(function (done) {
    app = requireHelper('server');
    done();
  });

  after(function () {
    //app.shutdown();
  });

  it('GET - /login responds successfully', (done) => {
    request(app)
      .get('/login')
      .expect(302, done);
  });

  it('GET - /logout responds successfully', (done) => {
    request(app)
      .get('/logout')
      .expect(302, done);
  });

});
