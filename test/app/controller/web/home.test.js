/*
 * @Author: MUHM
 * @Date: 2018-03-19 09:24:09
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-05-16 16:02:42
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/web/home.test.js', () => {
  beforeEach(async () => {
    app.mockCsrf();
  });
  it('home success', async () => {
    const result = await app.httpRequest()
      .get('/');
    assert.deepEqual(result.status, 200);
  });
  it('tag success', async () => {
    const result = await app.httpRequest()
      .get('/tag/1');
    assert.deepEqual(result.status, 200);
  });
  it('post not found', async () => {
    const result = await app.httpRequest()
      .get('/123123123');
    assert.deepEqual(result.status, 302);
  });
  it('post success', async () => {
    const ctx = app.mockContext();
    await ctx.model.Post.restore();
    const result = await app.httpRequest()
      .get('/title1');
    assert.deepEqual(result.status, 200);
  });
});
