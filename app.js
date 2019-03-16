/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:12:06
 * @Last Modified by: MUHM
 * @Last Modified time: 2019-03-15 21:36:41
 */
'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    app.locals.moment = require('moment');
    // Object.assign(app.locals, app.config);
    await app.setup();
    await app.runSchedule('app_locals');
  });
};
