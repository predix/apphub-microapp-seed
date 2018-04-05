'use strict';
process.env.SESSION_SECRET = 'mySecret';

const expect = require('chai').expect;
const request = require('supertest');
const helpers = require('../../helpers');
const requireHelper = helpers.require;
const express = require('express');
const Server = require('../../../src/server/common/server');

const router = new express.Router();
const tempApp = express();
router.get('/test', (req, res) =>{
  res.status(200).send({message: 'test'});
})

describe('Server', () => {
  var server, app;

  before(function (done) {
    server = new Server();
    app = server.getExpressApp();
    app.use(router);
    done();
  });

  after(function (done) {
    //server.shutdown(done);
    done();
  });

  it('should use app if passed', (done) => {
    var s = new Server(tempApp);
    expect(s);
    done();
  });

  xit('should have boot method', (done) => {
    expect(server.boot);
    server.boot(done);
  });

  xit('should have shutdown method', (done) => {
    expect(server.shutdown);
    server.shutdown(done);
  });

  it('GET - /test - responds successfully', (done) => {
    request(app)
      .get('/test')
      .expect(200, done);
  });
});
