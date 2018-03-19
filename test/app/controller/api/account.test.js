/*
 * @Author: MUHM
 * @Date: 2018-03-19 09:24:09
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-19 16:51:57
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/account.test.js', () => {
  it('register success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/register').send({
      name: 'test',
      password: '123456',
      email: 'test@test.com',
      mobile: '13888888888',
    });
    assert.deepEqual(result.body.code, 200);
  });
  it('register error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/register').send({
      name: 'test',
      password: '123456',
      email: 'test@test.com',
    });
    assert.deepEqual(result.body.code, 400);
    const result_1 = await app.httpRequest().post('/api/account/register').send({
      name: '1test',
      password: '123456',
      email: 'test@test',
    });
    assert.deepEqual(result_1.body.code, 400);
    const result_2 = await app.httpRequest().post('/api/account/register').send({
      name: 'test',
      password: '123456',
      email: 'test@test',
    });
    assert.deepEqual(result_2.body.code, 400);
  });
  it('login success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/login?redirectURL=/manage/home').send({
      name: 'admin',
      password: '123456',
    });
    assert.deepEqual(result.body.code, 200);
    const result_1 = await app.httpRequest().post('/api/account/login').send({
      name: 'test',
      password: '123456',
    });
    assert.deepEqual(result_1.body.code, 200);
  });
  it('login error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/login').send({
      name: 'admin1',
      password: '123456',
    });
    assert.deepEqual(result.body.code, 400);
  });
  it('change password success', async () => {
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    app.mockCsrf();
    app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
    const result = await app.httpRequest().post('/api/account/password').send({
      oldPwd: '123456',
      newPwd: '123456',
      confirmPwd: '123456',
    });
    assert.deepEqual(result.body.code, 200);
  });
  it('change password error', async () => {
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/password').send({
      oldPwd: '123456',
      newPwd: '123456',
      confirmPwd: '123456',
    });
    assert.deepEqual(result.body.code, 401);
    app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
    const result_1 = await app.httpRequest().post('/api/account/password').send({
      oldPwd: '123456',
      newPwd: '12345',
      confirmPwd: '123456',
    });
    assert.deepEqual(result_1.body.code, 400);
    const result_2 = await app.httpRequest().post('/api/account/password').send({
      oldPwd: '1234567',
      newPwd: '1234567',
      confirmPwd: '1234567',
    });
    assert.deepEqual(result_2.body.code, 400);
  });
  it('name success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/name?name=admin1');
    assert.deepEqual(result.body, true);
  });
  it('name error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/name?name=admin');
    assert.deepEqual(result.body, false);
    const result_1 = await app.httpRequest().get('/api/account/name?name=1admin');
    assert.deepEqual(result_1.body, false);
  });
  it('email success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/email?email=test1@test.com');
    assert.deepEqual(result.body, true);
  });
  it('email error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/email?email=test@test.com');
    assert.deepEqual(result.body, false);
    const result_1 = await app.httpRequest().get('/api/account/email?email=test@test');
    assert.deepEqual(result_1.body, false);
  });
  it('mobile success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/mobile?mobile=13777777777');
    assert.deepEqual(result.body, true);
  });
  it('mobile error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/mobile?mobile=13888888888');
    assert.deepEqual(result.body, false);
    const result_1 = await app.httpRequest().get('/api/account/mobile?mobile=1377777777');
    assert.deepEqual(result_1.body, false);
  });
});
