'use strict';
const expect = require('chai').expect;
const request = require('supertest');
const assert = require('chai').assert;
const locales = require('../../static/locales');
const Server = require('../../server/common/server');
const express = require('express');
describe('App Routes', () => {
  var app;

  before(function (done) {
    app = require('../../server');
    done();
  });

  after(function () {
    //app.shutdown();
  });

  xdescribe('/api', () => {
    var mockId = null;
    it('GET - / responds successfully', (done) => {
      request(app).get('/api/example').expect(200, done);
    });
    it('GET - / responds successfully', (done) => {
      request(app).get('/api/example/1').expect(200, done);
    });
    it('PUT - / responds successfully', (done) => {
      request(app)
        .put('/api/example/1').expect(200, done);
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
        });
    });
    it(`DELETE - /api/example/${mockId} - returns success`, (done) => {
      request(app).delete(`/api/example/${mockId}`).expect(200, done);
    });
    it(`DELETE - /api/example/some-id - returns error`, (done) => {
      request(app).delete(`/api/example/99`).expect(404, done);
    });
  });

  describe('/nav', () => {

    it('GET - /api/nav responds successfully', (done) => {
      request(app)
        .get('/api/nav')
        .expect(200, done);
    });

    it('PUT - /api/nav responds successfully', (done) => {
      request(app)
        .put('/api/nav')
        .send({
          "id": "settings",
          "label": "Settings",
          "path": "/settings"
        })
        .expect(200, done);
    });

    it('GET - /api/nav - responds successfully with nav service request', (done) => {
      request(app)
        .get('/api/nav')
        .expect(200, done);
    });

    xit('GET - /api/nav - responds successfully with nav service request when locale is in english', (done) => {
      request(app)
        .get('/api/nav')
        .set('Accept-Language', 'en')
        .expect(200)
        .expect(function (res) {
          expect(res.body[0].label).to.equal(locales.en.translation['APPLICATION_NAME']);
        })
        .end(done);
    });

    xit('GET - /api/nav - responds successfully with nav service request in a different langauge', (done) => {
      request(app)
        .get('/api/nav')
        .set('Accept-Language', 'es')
        .expect(200)
        .expect(function (res) {
          expect(res.body[0].label).to.equal(locales.es.translation['APPLICATION_NAME']);
        })
        .end(done);
    });

    xit('GET - /api/nav - responds successfully with nav service request when locale is switched back to english', (done) => {
      request(app)
        .get('/api/nav')
        .set('Accept-Language', 'en-US;q=0.8,en;es;q=0.6,zh-CN;q=0.4,zh;q=0.2') //with more noise
        .expect(function (res) {
          expect(res.body[0].label).to.equal(locales.en.translation['APPLICATION_NAME']);
        }).end(done);
    });

    xit('GET - /api/nav - responds successfully with sub nav items translated with a different language when locale is switched', (done) => {
      request(app)
        .get('/api/nav')
        .set('Accept-Language', 'es;en-US;q=0.8,en;q=0.6,zh-CN;q=0.4,zh;q=0.2') //with more noise
        .expect(function (res) {
          expect(res.body[0].items[0].label).to.equal(locales.es.translation['SUB_ITEM_1']);
          expect(res.body[0].items[1].label).to.equal(locales.es.translation['SUB_ITEM_2']);
          expect(res.body[0].items[2].label).to.equal(locales.es.translation['SUB_ITEM_3']);
          expect(res.body[0].items[3].label).to.equal(locales.es.translation['SUB_ITEM_4']);
        }).end(done);
    });
  });
});
