/*
 * @Author: MUHM
 * @Date: 2018-03-20 09:37:21
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-20 10:14:35
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/manage/api/permission.test.js', () => {
  it('200', async () => {
    app.mockCsrf();
    const ctx = app.mockContext();
    const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    await app.mockSession({
      userId: user.id,
      name: user.name,
      token: user.session_token,
    });
    const result = await app.httpRequest().get('/manage/api/permission');
    assert(result.body.code === 200);
  });
});
