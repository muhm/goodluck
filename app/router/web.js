/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:19:33
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-08 14:48:14
 */
'use strict';

module.exports = app => {
  const { router, controller } = app;
  /* account
   * 账号相关
   * */
  // 登录
  router.post('/api/account/login', controller.api.account.login);
  // 注册
  router.post('/api/account/register', controller.api.account.register);
  // 检查用户名
  router.get('/api/account/name', controller.api.account.name);
  // 检查邮箱
  router.get('/api/account/email', controller.api.account.email);
  // 检查手机
  router.get('/api/account/mobile', controller.api.account.mobile);
  router.get('/', controller.web.home.index);
  router.get('/account/login', controller.web.account.login);
  router.get('/account/register', controller.web.account.register);
  router.get('/account/logout', controller.web.account.logout);
  router.get('/account/password', controller.web.account.password);
};
