/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:18:39
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 10:01:16
 */
'use strict';

module.exports = app => {
  const { router, controller } = app;
  /*
  * web相关
  * */
  // 登录
  router.post('/api/account/login', controller.api.account.login);
  // 注册
  router.post('/api/account/register', controller.api.account.register);
  // 修改密码
  router.post('/api/account/password', controller.api.account.password);
  // 检查用户名
  router.get('/api/account/name', controller.api.account.name);
  // 检查邮箱
  router.get('/api/account/email', controller.api.account.email);
  // 检查手机
  router.get('/api/account/mobile', controller.api.account.mobile);
  // 检查slug
  router.get('/api/post/slug', controller.api.post.slug);
  require('./router/api_v1')(app);
  require('./router/manage')(app);
  require('./router/web')(app);
};
