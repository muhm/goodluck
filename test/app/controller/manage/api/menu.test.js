/*
 * @Author: MUHM
 * @Date: 2018-03-16 17:11:00
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-20 09:28:36
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/manage/api/menu.test.js', () => {
  it('200', async () => {
    app.mockCsrf();
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    await app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
    const result = await app.httpRequest().get('/manage/api/menu');
    assert(result.body.code === 200);
  });
  it('401', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/manage/api/menu');
    assert(result.body.code === 401);
  });  
  it('403', async () => {
    const ctx = app.mockContext();
    app.mockCsrf();
    const user = await ctx.model.User.findOne({ where: { name: 'test' } });
    await app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
    const result = await app.httpRequest().get('/manage/api/menu');
    assert(result.body.code === 403);
  });
});
