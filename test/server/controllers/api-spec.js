'use strict';
const request = require('supertest');
const expect = require('chai').expect;
const helpers = require('../../helpers');
const requireHelper = helpers.require;
const locales = requireHelper('server/locales');
describe('ApiController', () => {
  var app, mockId, mockDoc;
  const baseUrl = '/api/example';

  before(function () {
    //app = requireHelper('server/controllers/api');
    //todo - test in isolation
    app = requireHelper('server');
  });

  describe(baseUrl, () => {

    it(`GET - ${baseUrl} - 200 - responds success`, (done) => {
      request(app)
        .get(baseUrl)
        .expect(200, done);
    });

    it(`POST - ${baseUrl} - 200 - responds successfully`, (done) => {
      request(app)
        .post(baseUrl)
        .send({
          some: 'value'
        })
        .expect(201)
        .end((err, res) => {
          mockDoc = res.body.doc;
          mockId = mockDoc.id;
          done();
        });
    });

    it(`GET - ${baseUrl} - 200 - responds success`, (done) => {
      request(app)
        .get(`${baseUrl}?some=value`)
        .expect(200, done);
    });


    it(`GET - ${baseUrl}/:id - 200 - responds success`, (done) => {
      request(app)
        .get(`${baseUrl}/${mockId}`)
        .expect(200, done);
    });

    it(`PUT - ${baseUrl}/:id - 200 - responds success`, (done) => {
      mockDoc.updated = Date.now();
      request(app)
        .get(`${baseUrl}/${mockId}`)
        .send(mockDoc)
        .expect(200, done);
    });

    it(`PUT - ${baseUrl}/:id - 404 - responds not found`, (done) => {
      request(app)
        .put(`${baseUrl}/100`)
        .send({
          name: 'updated-name'
        })
        .expect(404, done);
    });

    it(`DELETE - ${baseUrl}/:id - 404 - responds not found`, (done) => {
      request(app)
        .delete(`${baseUrl}/100`)
        .expect(404, done);
    });

    it(`DELETE - ${baseUrl}/:id - 200 - responds success`, (done) => {
      request(app).delete(`${baseUrl}/${mockId}`).expect(200, done);
    });


    describe('i18 locales', () => {

      ['ar', 'de', 'en', 'es', 'hi', 'zh'].forEach((locale) => {
        it(`GET - /api - responds successfully when locale is [${locale}]`, (done) => {
          request(app)
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

});
