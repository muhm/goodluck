/*
 * @Author: MUHM
 * @Date: 2018-03-21 15:05:51
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-22 14:05:10
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/user.test.js', () => {
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
      .get('/api/user?start=0&length=10');
    assert.deepEqual(result.body.code, 200);
  });
  it('get show success', async () => {
    const result = await app.httpRequest()
      .get('/api/user/1');
    assert.deepEqual(result.body.code, 200);
  });
  it('get show 404', async () => {
    const result = await app.httpRequest()
      .get('/api/user/20');
    assert.deepEqual(result.body.code, 404);
  });
  it('create 200', async () => {
    const result = await app.httpRequest()
      .post('/api/user')
      .send({
        name: 'test001',
        truename: '测试成功',
      });
    assert.deepEqual(result.body.code, 200);
  });
  it('update success', async () => {
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'test001' } });
    const result = await app.httpRequest()
      .put('/api/user')
      .send({
        id: user.id,
        truename: '测试成功',
        email: 'test001@test.com',
        status: 0,
        roles: [1],
      });
    assert.deepEqual(result.body.code, 200);
  });
  it('update error', async () => {
    const result = await app.httpRequest()
      .put('/api/user')
      .send({
        id: 111,
        truename: '测试失败',
        email: 'test001@test.com',
        status: 0,
        roles: [1],
      })
      .set('Accept', 'application/json');
    assert.deepEqual(result.body.code, 500);
  });
});
