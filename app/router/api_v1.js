/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-17 14:05:31
 */
'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/api/v1/system/time', controller.api.v1.system.time);
  router.post('/api/v1/token', controller.api.v1.token.create);
  router.put('/api/v1/token/:access_token/:refresh_token', controller.api.v1.token.update);
  router.del('/api/v1/token/:access_token', controller.api.v1.token.destroy);
};
