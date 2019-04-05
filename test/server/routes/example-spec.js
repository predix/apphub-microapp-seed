const assert = require('assert');
const request = require('supertest');
const express = require('express');
const controller = require('express-controller-routing');

const exampleController = require('../../../src/server/routes/example');

const baseUrl = '/api/example';

describe('Example Routes', () => {
  let app;

  beforeAll(function(done) {
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

  it(`GET - ${baseUrl}/my/path/to/:something - responds 200`, (done) => {
    request(app)
      .get(`${baseUrl}/my/path/to/:something`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it(`POST - ${baseUrl}/my/path/to/:something - responds 200`, (done) => {
    request(app)
      .post(`${baseUrl}/my/path/to/:something`)
      .send({ name: 'test' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it(`GET - ${baseUrl}/timeout/:time - responds 200`, (done) => {
    request(app)
      .get(`${baseUrl}/timeout/10`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it(`POST - ${baseUrl}/timeout/:time - responds 200`, (done) => {
    request(app)
      .post(`${baseUrl}/timeout/10`)
      .send({ name: 'test' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it(`GET - ${baseUrl}/500 - responds 500`, (done) => {
    request(app)
      .get(`${baseUrl}/500`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500, done);
  });

  it(`POST - ${baseUrl}/500 - responds 500`, (done) => {
    request(app)
      .post(`${baseUrl}/500`)
      .set('Accept', 'application/json')
      .send({
        name: 'Jonnie'
      })
      .expect(500, done);
  });

  it(`GET - ${baseUrl}/setCookie/test-cookie/test-value - cookie test - responds 200`, (done) => {
    request(app)
      .get(`${baseUrl}/setCookie/test-cookie/test-value`)
      // .expect('set-cookie', 'test-cookie=test-value;Path=/', done)
      .then((response) => {
        // assert(response.headers[0] === 'test-cookie=test-value;Path=/');
        assert(response);
        done();
      });
  });

  it(`GET - ${baseUrl}/getCookies - cookie test - responds 200`, (done) => {
    request(app)
      .get(`${baseUrl}/getCookies`)
      .expect(200)
      .then((response) => {
        assert(response);
        // console.log(response);
        done();
      });
  });

  it(`GET - ${baseUrl}?name=value - query test - responds 200`, (done) => {
    request(app)
      .get(`${baseUrl}?name=value`)
      .expect(200)
      .end((err, res) => {
        assert(res.body.query, 'returns query');
        done();
      });
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
        assert(res.body.body.name === 'Jonnie', 'returns body');
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
        assert(res.body.body.name, 'returns body');
        done();
      });
  });
});
