/*
 * @Author: MUHM
 * @Date: 2018-03-19 09:24:09
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-05-16 16:03:12
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/manage/home.test.js', () => {
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
  it('view success', async () => {
    const ctx = app.mockContext();
    const permission = await ctx.model.Permission.findAll({ where: { is_menu: 1 } });
    for (let i = 0, len = permission.length; i < len; i++) {
      if (permission[i].url.length > 1) {
        const result = await app.httpRequest()
          .get(permission[i].url);
        assert.deepEqual(result.status, 200);
      }
    }
  });
  it('post upsert view success', async () => {
    const result = await app.httpRequest()
      .get('/manage/post/upsert/~');
    assert.deepEqual(result.status, 200);
  });
  it('login view 302', async () => {
    const result = await app.httpRequest()
      .get('/manage/login');
    assert.deepEqual(result.status, 302);
  });
  it('logout view 302', async () => {
    const result = await app.httpRequest()
      .get('/manage/logout');
    assert.deepEqual(result.status, 302);
  });
  it('login view 200', async () => {
    await app.mockSession({
      userId: null,
    });
    const result = await app.httpRequest()
      .get('/manage/login');
    assert.deepEqual(result.status, 200);
  });
  it('login view 200', async () => {
    await app.mockSession({
      userId: null,
    });
    const result = await app.httpRequest()
      .get('/manage/login?redirectURL=/test');
    assert.deepEqual(result.status, 200);
  });
  it('register view 200', async () => {
    const result = await app.httpRequest()
      .get('/manage/register');
    assert.deepEqual(result.status, 200);
  });

  it('password view 200', async () => {
    const result = await app.httpRequest()
      .get('/manage/password');
    assert.deepEqual(result.status, 200);
  });
  it('password view 302', async () => {
    await app.mockSession({
      userId: null,
    });
    const result = await app.httpRequest()
      .get('/manage/password');
    assert.deepEqual(result.status, 302);
  });

});
