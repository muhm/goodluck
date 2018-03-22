/*
 * @Author: MUHM
 * @Date: 2018-03-16 11:13:42
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-22 14:27:56
 */
'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/schedule/app_locals.test.js', () => {
  it('app_locals', async () => {
    await app.ready();
    await app.runSchedule('app_locals');
    assert(app.locals);
  });
});
