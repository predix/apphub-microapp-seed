const assert = require('assert');
const request = require('supertest');
const express = require('express');
const controller = require('express-controller-routing');

const ctrl = require('../../../src/server/routes/nav/index');
const Model = require('../../../src/server/routes/nav/model');

const baseUrl = '/api/nav';

describe('Nav Routes', () => {
  let app;

  beforeAll(function(done) {
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

describe('Nav Model', () => {
  let myModel;

  beforeAll(() => {
    myModel = new Model();
  });

  it('get - returns nav', async () => {
    const nav = await myModel.get();
    assert(nav, 'returns items');
    return nav;
  });

  it('read - returns nav', async () => {
    const nav = await myModel.read();
    assert(nav, 'returns items');
    return nav;
  });

  it('update - updates nave', async () => {
    const updatedItem = await myModel.update({
      path: '/new-path',
      label: 'New Item'
    });
    assert(updatedItem.length, 'returns array');
    assert(updatedItem.filter((obj) => obj.path === '/new-path'));
    return updatedItem;
  });
});
