/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:18:39
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-28 21:54:57
 */
'use strict';

module.exports = async app => {
  // const authorize = app.middlewares.authorize(app);
  const authorize = app.middlewares.authorize();
  const { router, controller, model } = app;

  router.get('/', controller.web.home.index);

  // router.get('/tag', controller.web.home.index);
  router.get('/api/tag/list', controller.api.tag.index);
  router.get('/tag/:id', controller.web.home.tag);
  router.get('/api/tag/show/:id', controller.api.tag.show);

  // router.get('/post', controller.web.post.index);
  router.get('/api/post/list', controller.api.post.list);

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

  router.get('/manage/login', controller.manage.account.login);
  router.get('/manage/register', controller.manage.account.register);
  router.get('/manage/logout', controller.manage.account.logout);
  router.get('/manage/password', controller.manage.account.password);

  const permission = await model.Permission.findAll();
  permission.forEach(element => {
    if (element.method) {
      let controllerAction = controller;
      if (element.area) {
        const areas = element.area.split('.');
        areas.forEach(area => {
          controllerAction = controllerAction[area];
        });
      }
      controllerAction = controllerAction[element.controller][element.action];
      router[element.method](element.url, authorize, controllerAction);
    }
  });

  router.get('/:slug', controller.web.home.post);
  router.get('/api/post/slug/:slug', controller.web.home.index);

  // 开放api
  router.post('/api/open/token', controller.api.token.create);
  router.put('/api/open/token/:access_token/:refresh_token', controller.api.token.update);
  router.del('/api/open/token/:access_token', controller.api.token.destroy);

};
