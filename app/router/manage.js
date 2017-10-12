/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 15:20:42
 */
'use strict';

module.exports = app => {
  // 获取服务器时间
  app.get('/manage', app.controller.manage.home.index);
};
