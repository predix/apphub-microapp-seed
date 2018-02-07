'use strict';
const request = require('supertest');
const express = require('express');
const controller = require('express-controller-routing');

const ctrl = require('../../../src/server/routes/nav');
const baseUrl = '/api/nav';

describe('Nav Routes', () => {
  var app;

  before(function (done) {
    app = express();
    app.use(baseUrl, controller(ctrl));
    done();
  });

  it(`GET - ${baseUrl} responds successfully`, (done) => {
    request(app)
      .get(baseUrl)
      .expect(200, done);
  });

});
