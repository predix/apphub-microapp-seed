'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const Server = require('../../../server/index');
const assert = require('assert');

describe('App', () => {
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

  xit('should handle json errors', (done) => {
    request(Server.getExpressApp())
      .get('/api/something-not-found')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('boot - should start server', (done) => {
    Server.boot(function(resp) {
      assert(resp);
      done();
    });
  });

  it('shutdown - should stop server', (done) => {
    Server.shutdown(done);
  });




});
