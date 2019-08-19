const assert = require('assert');
const request = require('supertest');
const bodyParser = require('body-parser');
const express = require('express');

// const middleware = require('../../../src/server/middleware');
const routes = require('../../../src/server/routes');

// const controller = require('express-controller-routing');
// const apiController = require('../../../src/server/routes/api');

const baseUrl = '/api/db';

describe('API Routes', function() {
  // this.timeout(20000);
  let app;
  let mockId;
  let mockDoc;

  beforeAll(function(done) {
    app = express();
    app.use(bodyParser.json());
    app.use((req, res, next) => {
      req.t = () => {};
      next();
    });

    // middleware(app);
    routes(app);
    // app.use('/api', controller(apiController));
    done();
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
          mockId = mockDoc._id;
          done();
        });
    });

    it(`POST - ${baseUrl}/_bulk_docs - 200 - responds success`, (done) => {
      const docs = [
        mockDoc,
        { name: 'doc-1', type: 'doc' },
        { name: 'doc-2', type: 'comment' },
        { name: 'doc-3', type: 'post' }
      ];
      request(app)
        .post(`${baseUrl}/_bulk_docs`)
        .send(docs)
        .expect(200, done);
    });

    it(`GET - ${baseUrl} - 200 - responds success`, (done) => {
      request(app)
        .get(`${baseUrl}?some=value`)
        .expect(200, done);
    });

    it(`GET - ${baseUrl}/_all_docs - 200 - responds success`, (done) => {
      request(app)
        .get(`${baseUrl}/_all_docs`)
        .expect(200, done);
    });

    it(`GET - ${baseUrl}/_all_docs?type=doc - 200 - responds success`, (done) => {
      request(app)
        .get(`${baseUrl}/_all_docs?type=doc`)
        .end((err, res) => {
          assert(res.body.length === 1, 'returns correct items');
          assert(res.body.length, 'returns array');
          // console.log('All DOcs', res.body);
          done();
        });
    });

    it(`POST/GET - ${baseUrl}/:id - 200 - responds success`, (done) => {
      request(app)
        .post(baseUrl)
        .send({
          _id: 'test',
          some: 'value'
        })
        .expect(201)
        .end((err, res) => {
          mockDoc = res.body.doc;
          assert(mockDoc._id, 'returns object with create _id');
          mockId = mockDoc._id;
          request(app)
            .get(`${baseUrl}/${mockId}`)
            .expect(200)
            .end((er, r) => {
              assert(!er, 'does not have error');
              assert(r.body._id === mockId, 'returned _id matches');
              done();
            });
        });
    });

    it(`PUT - ${baseUrl}/:id - 200 - responds success`, (done) => {
      mockDoc.updated = Date.now();
      request(app)
        .get(`${baseUrl}/${mockDoc._id}`)
        .send(mockDoc)
        .expect(200, done);
    });

    it(`GET - ${baseUrl}/:id - 404 - responds not found`, (done) => {
      request(app)
        .get(`${baseUrl}/100`)
        .expect(404, done);
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
      request(app)
        .post(`${baseUrl}`)
        .send({ name: 'delete me' })
        .expect(201)
        .end((err, res) => {
          request(app)
            .delete(`${baseUrl}/${res.body.doc._id}`)
            .expect(200, done);
        });
    });
  });
});
