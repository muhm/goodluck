/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:12:06
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-27 16:38:26
 */
'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    app.locals.moment = require('moment');
    await app.setup();
    await app.runSchedule('app_locals');
  });
};
