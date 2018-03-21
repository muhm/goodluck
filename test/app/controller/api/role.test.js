/*
 * @Author: MUHM
 * @Date: 2018-03-20 16:16:15
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-21 15:56:47
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/role.test.js', () => {
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
      .get('/api/role?start=0&length=10');
    assert.deepEqual(result.body.code, 200);
  });
  it('get show success', async () => {
    const result = await app.httpRequest()
      .get('/api/role/1');
    assert.deepEqual(result.body.code, 200);
  });
  it('get show 404', async () => {
    const result = await app.httpRequest()
      .get('/api/role/2')
      .set('Accept', 'application/json');
    assert.deepEqual(result.body.code, 500);
  });
  it('create 200', async () => {
    const result = await app.httpRequest()
      .post('/api/role')
      .send({
        name: 'name',
        description: 'description',
        permissions: [],
      });
    assert.deepEqual(result.body.code, 200);
  });
  it('update success', async () => {
    const result = await app.httpRequest()
      .put('/api/role')
      .send({
        id: 2,
        name: 'name',
        description: 'description',
        permissions: [1],
      });
    assert.deepEqual(result.body.code, 200);
  });
  it('update error', async () => {
    const result = await app.httpRequest()
      .put('/api/role')
      .send({
        id: 3,
        name: 'name',
        description: 'description',
        permissions: [1],
      })
      .set('Accept', 'application/json');
    assert.deepEqual(result.body.code, 500);
  });
  it('delete 200', async () => {
    const result = await app.httpRequest()
      .delete('/api/role/2');
    assert.deepEqual(result.body.code, 200);
  });
  it('delete 400', async () => {
    const result = await app.httpRequest()
      .delete('/api/role/20');
    assert.deepEqual(result.body.code, 400);
  });
});
