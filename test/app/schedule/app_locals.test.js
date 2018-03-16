/*
 * @Author: MUHM
 * @Date: 2018-03-16 11:13:42
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-16 14:09:09
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/schedule/app_locals.test.js', () => {
  it('app_locals', async () => {
    await app.ready();
    const ctx = app.mockContext();
    const setting = await ctx.model.Setting.findOne({ where: { key: 'cdn' } });
    if (!setting.value) {
      setting.value = 'http://127.0.0.1';
      await setting.save();
    }
    await app.runSchedule('app_locals');
    assert(app.locals);
    setting.value = null;
    await setting.save();
  });
});
