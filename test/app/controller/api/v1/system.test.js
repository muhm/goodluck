/*
 * @Author: MUHM
 * @Date: 2018-03-16 11:13:42
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-16 13:29:11
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/v1/system.test.js', () => {
  it('200', async () => {
    const result = await app.httpRequest().get('/api/v1/system/time').send({
      uuid: '4d014be0-af29-11e7-8094-33e8f708f39e',
      secret: '123456',
    });
    assert(result.status === 200);
  });
});
