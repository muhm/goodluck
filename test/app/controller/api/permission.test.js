/*
 * @Author: MUHM
 * @Date: 2018-03-16 17:11:00
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-21 15:56:34
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/permission.test.js', () => {
  beforeEach(async () => {
    app.mockCsrf();
  });
  it('menu 200', async () => {
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    await app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
    const result = await app.httpRequest()
      .get('/api/permission/menu');
    assert(result.body.code === 200);
  });
  it('menu 401', async () => {
    const result = await app.httpRequest()
      .get('/api/permission/menu');
    assert(result.body.code === 401);
  });
  it('menu 403', async () => {
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'test' } });
    await app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
    const result = await app.httpRequest()
      .get('/api/permission/menu');
    assert(result.body.code === 403);
  });
  it('permission 200', async () => {
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    await app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
    const result = await app.httpRequest()
      .get('/api/permission');
    assert(result.body.code === 200);
  });
});
