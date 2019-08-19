const sinon = require('sinon');
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');

const Server = require('../../../src/server/common/server');

process.env.SESSION_SECRET = 'mySecret';

const router = new express.Router();
const tempApp = express();

router.get('/test', (req, res) => {
  res.status(200).send({ message: 'test' });
});

describe('Server', () => {
  let server;
  let app;

  beforeAll(function(done) {
    server = new Server();
    app = server.getExpressApp();
    app.use(router);
    done();
  });

  afterAll(function(done) {
    server.shutdown(done);
    done();
  });
  it('should use app if passed', (done) => {
    const s = new Server(tempApp);
    expect(s);
    done();
  });

  it('boot - should have method', () => {
    expect(server.boot).to.not.be.null;
    // server.boot(done);
  });

  it('listen - should have method', () => {
    expect(server.listen).to.not.be.null;
    // server.boot(done);
  });

  it('shutdown - should have method', () => {
    expect(server.shutdown).to.not.be.null;
    // server.shutdown(done);
  });

  it('getHTTPServer - should return http instance', () => {
    expect(server.getHTTPServer).to.not.be.null;
  });

  it('listen - should launch server on port', (done) => {
    const newServer = new Server(tempApp);
    const spy = sinon.spy();
    newServer.listen(0, (err, a) => {
      spy(a);
      expect(!err);
      expect(spy.called).to.be.true;
      done();
    });
  });

  it('GET - /test - responds successfully', (done) => {
    request(app)
      .get('/test')
      .expect(200, done);
  });
});
