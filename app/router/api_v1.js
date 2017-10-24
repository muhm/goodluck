/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-24 10:52:05
 */
'use strict';

module.exports = app => {
  // 获取服务器时间
  app.get('/api/v1/system/time', app.controller.api.v1.system.time);
  app.post('/api/v1/token', app.controller.api.v1.token.create);
  app.put('/api/v1/token/:access_token/:refresh_token', app.controller.api.v1.token.update);
  app.del('/api/v1/token/:access_token', app.controller.api.v1.token.destroy);
};
