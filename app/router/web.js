/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 15:20:47
 */
'use strict';

module.exports = app => {
  // 获取服务器时间
  app.get('/', app.controller.web.home.index);
};
