/*
 * @Author: MUHM
 * @Date: 2018-03-19 09:24:09
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-19 10:44:38
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/account.test.js', () => {
  it('login success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/login').send({
      name: 'admin',
      password: '123456',
    });
    assert(result.body.code === 200);
  });
  it('login error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/login').send({
      name: 'admin1',
      password: '123456',
    });
    assert(result.body.code === 400);
  });
  it('register success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/register').send({
      name: 'test',
      password: '123456',
      email: 'test@test.com',
      mobile: '13888888888',
    });
    assert(result.body.code === 200);
  });
  it('register error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().post('/api/account/register').send({
      name: 'test',
      password: '123456',
      email: 'test@test.com',
    });
    assert(result.body.code === 400);
    const result_1 = await app.httpRequest().post('/api/account/register').send({
      name: '1test',
      password: '123456',
      email: 'test@test',
    });
    assert(result_1.body.code === 400);
    const result_2 = await app.httpRequest().post('/api/account/register').send({
      name: 'test',
      password: '123456',
      email: 'test@test',
    });
    assert(result_2.body.code === 400);
  });
  it('name success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/name?name=admin1');
    assert(result.body === true);
  });
  it('name error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/name?name=admin');
    assert(result.body === false);
    const result_1 = await app.httpRequest().get('/api/account/name?name=1admin');
    assert(result_1.body === false);
  });
  it('email success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/email?email=test1@test.com');
    assert(result.body === true);
  });
  it('email error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/email?email=test@test.com');
    assert(result.body === false);
    const result_1 = await app.httpRequest().get('/api/account/email?email=test@test');
    assert(result_1.body === false);
  });
  it('mobile success', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/mobile?mobile=13777777777');
    assert(result.body === true);
  });
  it('mobile error', async () => {
    app.mockCsrf();
    const result = await app.httpRequest().get('/api/account/mobile?mobile=13888888888');
    assert(result.body === false);
    const result_1 = await app.httpRequest().get('/api/account/mobile?mobile=1377777777');
    assert(result_1.body === false);
  });
});
