'use strict';
const request = require('supertest');

const helpers = require('../../helpers');
const requireHelper = helpers.require;

describe('ApiController', () => {
  var app, mockId;
  const baseUrl = '/api/example';

  before(function (done) {
    //app = requireHelper('server/controllers/api');
    //todo - test in isolation
    app = requireHelper('server');
    done();
  });

  describe(baseUrl, () => {

    it(`GET - ${baseUrl} - 200 - responds success`, (done) => {
      request(app)
        .get(baseUrl)
        .expect(200, done);
    });



    it('POST - / responds successfully', (done) => {
      request(app)
        .post('/api/example')
        .send({
          some: 'value'
        })
        .expect(201)
        .end((err, res) => {
          mockId = res.body.id;
          console.log('response', res);
          done();
        });
    });

    it(`GET - ${baseUrl}/:id - 200 - responds success`, (done) => {
      request(app)
        .get(`/api/example/${mockId}`)
        .expect(200, done);
    });

    it(`PUT - ${baseUrl}/:id - 200 - responds success`, (done) => {
      request(app)
        .get(`/api/example/${mockId}`)
        .send({
          name: 'updated-name'
        })
        .expect(200, done);
    });

    it(`PUT - ${baseUrl}/:id - 404 - responds not found`, (done) => {
      request(app)
        .put('/api/example/100')
        .send({
          name: 'updated-name'
        })
        .expect(404, done);
    });

    it(`DELETE - ${baseUrl}/:id - 404 - responds not found`, (done) => {
      request(app)
        .delete('/api/example/100')
        .expect(404, done);
    });

    it(`DELETE - ${baseUrl}/:id - 200 - responds success`, (done) => {
      request(app).delete(`/api/example/${mockId}`).expect(200, done);
    });

  });

});
