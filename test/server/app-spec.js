'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const Server = require('../../server/common/server');

const helpers = require('../helpers');
const requireHelper = helpers.require;

describe('App', () => {
  var app;
  before(function (done) {
    app = require('../../server/index').getExpressApp();
    done();
  });

  after(function () {
    //app.shutdown();
  });

  it('should start', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });

  xit('should handle errors', (done) => {
    request(app)
      .get('/api/something-not-found')
      .expect(404, done);
  });

});
