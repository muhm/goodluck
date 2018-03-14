/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 09:37:22
 */
'use strict';

module.exports = app => {
  const { router, controller } = app;
  /* account
   * 账号相关
   * */
  router.get('/', controller.web.home.index);
  router.get('/account/login', controller.web.account.login);
  router.get('/account/register', controller.web.account.register);
  router.get('/account/logout', controller.web.account.logout);
  router.get('/account/password', controller.web.account.password);
};
