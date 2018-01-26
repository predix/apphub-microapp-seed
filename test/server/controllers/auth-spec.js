'use strict';
const request = require('supertest');
const helpers = require('../../helpers');
const requireHelper = helpers.require;

//const locales = requireHelper('server/locales');

describe('/login', () => {
  var app;

  before(function (done) {
    app = require('../../../server/index').getExpressApp();
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

  it('GET - /user/info - responds successfully', (done) => {
    request(app)
      .get('/user/info')
      .expect(200, done);
  });
  it('GET - /user/verify - responds successfully', (done) => {
    request(app)
      .get('/user/verify')
      .expect(200, done);
  });

});
