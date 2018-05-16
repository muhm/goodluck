/*
 * @Author: MUHM
 * @Date: 2018-03-21 15:12:38
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-05-16 14:33:24
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/tag.test.js', () => {
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
      .get('/api/tag?start=0&length=10');
    assert.deepEqual(result.body.code, 200);
  });
  it('get index success', async () => {
    const result = await app.httpRequest()
      .get('/api/tag');
    assert.deepEqual(result.body.code, 200);
  });
  it('create success', async () => {
    const result = await app.httpRequest()
      .post('/api/tag')
      .send({
        name: 'name',
        description: 'description',
      });
    assert.deepEqual(result.body.code, 200);
  });
  it('create error', async () => {
    const result = await app.httpRequest()
      .post('/api/tag')
      .set('Accept', 'application/json')
      .send({
        name: 'name',
        description: 'description',
      });
    assert.deepEqual(result.body.code, 500);
  });
  it('get show success', async () => {
    const ctx = app.mockContext();
    const tag = await ctx.model.Tag.findOne({ where: { name: 'name' } });
    const result = await app.httpRequest()
      .get('/api/tag/' + tag.id);
    assert.deepEqual(result.body.code, 200);
  });
  it('get show 404', async () => {
    const result = await app.httpRequest()
      .get('/api/tag/2');
    assert.deepEqual(result.body.code, 404);
  });
  it('update 200', async () => {
    const result = await app.httpRequest()
      .put('/api/tag')
      .send({
        id: 1,
        name: 'name',
        description: 'description',
      });
    assert.deepEqual(result.body.code, 200);
  });
  it('delete 200', async () => {
    const ctx = app.mockContext();
    const tag = await ctx.model.Tag.findOne({ where: { name: 'name' } });
    const result = await app.httpRequest()
      .delete('/api/tag/' + tag.id);
    assert.deepEqual(result.body.code, 200);
  });
  it('delete 400', async () => {
    const result = await app.httpRequest()
      .delete('/api/tag/2');
    assert.deepEqual(result.body.code, 400);
  });
  it('create 200 same name different slug', async () => {
    const result = await app.httpRequest()
      .post('/api/tag')
      .send({
        name: 'name',
        description: 'description',
      });
    assert.deepEqual(result.body.code, 200);
  });
});
