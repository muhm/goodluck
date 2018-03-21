/*
 * @Author: MUHM
 * @Date: 2018-03-21 15:05:51
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-21 15:57:03
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/site.test.js', () => {
  beforeEach(async () => {
    app.mockCsrf();
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    await app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
  });
  it('get index success', async () => {
    const result = await app.httpRequest()
      .get('/api/site?start=0&length=10');
    assert.deepEqual(result.body.code, 200);
  });
  it('get show success', async () => {
    const result = await app.httpRequest()
      .get('/api/site/1');
    assert.deepEqual(result.body.code, 200);
  });
  it('get show 404', async () => {
    const result = await app.httpRequest()
      .get('/api/site/20').set('Accept', 'application/json');
    assert.deepEqual(result.body.code, 500);
  });
  it('update 200', async () => {
    const result = await app.httpRequest()
      .put('/api/site')
      .send({
        id: 1,
        value: '1.0.1',
      });
    assert.deepEqual(result.body.code, 200);
  });
});
