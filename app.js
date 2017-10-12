/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:12:06
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 13:49:37
 */
'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    // setup
    app.locals.moment = require('moment');
    await app.model.sync({ force: true });
  });
};
