'use strict';
const request = require('supertest');
const expect = require('chai').expect;
const helpers = require('../../helpers');
const requireHelper = helpers.require;
const locales = requireHelper('server/middleware/localize/locales');
const bodyParser = require('body-parser');
const express = require('express');
const controller = require('express-controller-routing');
const apiController = require('../../../src/server/routes/api');
const baseUrl = '/api/db';

describe('API Routes', function() {
  this.timeout(20000);
  var app, mockId, mockDoc;

  before(function (done) {
    app = express();
    app.use(bodyParser.json());
    app.use((req, res, next) => {
      req.t = () => {};
      next();
    });
    app.use(baseUrl, controller(apiController));
    done();
  });

  xdescribe(baseUrl, () => {

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

  });

});
