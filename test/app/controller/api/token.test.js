/*
 * @Author: MUHM
 * @Date: 2018-03-16 11:13:42
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-20 17:09:31
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/open/token.test.js', () => {
  const uuid = '4d014be0-af29-11e7-8094-33e8f708f39e';
  const secret = '123456';
  let token;
  it('401', async () => {
    const result = await app.httpRequest().post('/api/open/token');
    assert.deepEqual(result.body.code, 401);
  });
  it('post 200', async () => {
    const result = await app.httpRequest().post('/api/open/token').send({
      uuid,
      secret,
      account: 'admin',
      password: '123456',
    });
    assert.deepEqual(result.body.code, 200);
    token = result.body.data.token;
  });
  it('put 200', async () => {
    const result = await app.httpRequest().put(`/api/open/token/${token.access_token}/${token.refresh_token}`).send({
      uuid,
      secret,
    });
    assert.deepEqual(result.body.code, 200);
    token = result.body.data.token;
  });
  it('put token与refresh_token不正确', async () => {
    const result = await app.httpRequest().put(`/api/open/token/${token.access_token}error/${token.refresh_token}`).send({
      uuid,
      secret,
    });
    assert.deepEqual(result.body.code, 400);
  });
  it('put refresh_token过期', async () => {
    const ctx = app.mockContext();
    const _token = await ctx.model.Token.findOne({ where: { access_token: token.access_token } });
    _token.refresh_token_expires_at = ctx.locals.moment().add(-1, 'day');
    await _token.save();
    const result = await app.httpRequest().put(`/api/open/token/${token.access_token}/${token.refresh_token}`).send({
      uuid,
      secret,
    });
    assert.deepEqual(result.body.code, 400);
  });
  it('delete 200', async () => {
    const result = await app.httpRequest().delete(`/api/open/token/${token.access_token}`).send({
      uuid,
      secret,
    });
    assert.deepEqual(result.body.code, 200);
  });
});
