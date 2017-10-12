/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 14:22:20
 */
'use strict';

module.exports = app => {
  app.get('/api/v2/system/time', app.controller.api.v2.system.time);
};
