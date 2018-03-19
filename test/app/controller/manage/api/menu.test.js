/*
 * @Author: MUHM
 * @Date: 2018-03-16 17:11:00
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-19 11:35:47
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/manage/api/menu.test.js', () => {
  it('401', async () => {
    const ctx = app.mockContext();
    // const user = await ctx.model.User.findOne({ where: { name: 'admin' } });
    // app.mockSession({
    //   userId: user.id,
    //   name: user.name,
    //   token: user.session_token,
    // });
    app.mockCsrf();
    const result = await app.httpRequest().get('/manage/api/menu');
    assert(result.body.code === 401);
  });
});
