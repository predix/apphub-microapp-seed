'use strict';
require('dotenv').config();
const expect = require('chai').expect;
const request = require('supertest');
const Server = require('../../../src/server/index');
const assert = require('assert');
const locales = require('../../../src/server/middleware/localize/locales');

describe('App Middleware', () => {
  var app, instance;
  before(function (done) {
    done();
  });

  after(function () {
    //app.shutdown();
  });

  it('listen - should start server', (done) => {
    request(Server.getExpressApp())
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should handle ajax errors', (done) => {
    request(Server.getExpressApp())
      .get('/api/something-not-found')
      .set('X-Requested-With', 'XMLHttpRequest')
    //  .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should handle cache-control', (done) => {
    request(Server.getExpressApp())
      .get('/api')
      .set('Cache-Control', '1d')
    //  .expect('Content-Type', /json/)
      .expect(200, done);
  });

  xit('should handle json errors', (done) => {
    request(Server.getExpressApp())
      .get('/api/something-not-found')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('boot - should start server', (done) => {
    Server.boot(function(err, resp) {
      assert(resp);
      done();
    });
  });

  it('shutdown - should stop server', (done) => {
    Server.shutdown(done);
  });


  describe('i18 locales', () => {

    ['ar', 'de', 'en', 'es', 'hi', 'zh'].forEach((locale) => {
      it(`GET - /api - responds successfully when locale is [${locale}]`, (done) => {
        request(Server.getExpressApp())
          .get('/api')
          .set('Accept-Language', locale)
          .expect(200)
          .expect(function (res) {
            expect(res.body.name).to.equal(locales[locale].translation['APPLICATION_NAME']);
          })
          .end(done);
      });
    });

  });




});
