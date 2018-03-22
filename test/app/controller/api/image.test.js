/*
 * @Author: MUHM
 * @Date: 2018-03-22 09:28:16
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-22 09:38:12
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/api/image.test.js', () => {
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
  it('image success', async () => {
    const result = await app.httpRequest()
      .post('/api/image').attach('test', 'app/public/manage/images/img_404.png');
    assert(result.body.code === 200);
  });
});
