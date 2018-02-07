'use strict';
const assert = require('assert');
const request = require('supertest');
const express = require('express');
const controller = require('express-controller-routing');

const exampleController = require('../../../src/server/routes/example');
const baseUrl = '/api/example';

describe('Example Routes', () => {
  var app;

  before(function (done) {
    app = express();
    app.use(baseUrl, controller(exampleController));
    done();
  });

  it(`GET - ${baseUrl} - responds 200`, (done) => {
    request(app)
      .get(baseUrl)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it(`GET - ${baseUrl}?name=value - query test - responds 200`, (done) => {
    request(app)
      .get(`${baseUrl}?name=value`)
      .expect(200, done);
  });

  it(`POST - ${baseUrl} - post test - responds 200`, (done) => {
    request(app)
      .post(baseUrl)
      .send({
        name: 'Jonnie',
        age: 31
      })
      .expect(201)
      .end((err, res) => {
        assert(res.body.headers, 'returns headers');
        assert(res.body.body.name, 'returns posted body');
        done();
      });
  });

  it(`PUT - ${baseUrl} - put test - responds 200`, (done) => {
    request(app)
      .put(baseUrl)
      .send({
        name: 'Jonnie',
        age: 31
      })
      .expect(200)
      .end((err, res) => {
        assert(res.body.headers, 'returns headers');
        assert(res.body.body.name, 'returns posted body');
        done();
      });
  });

});
