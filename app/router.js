/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:18:39
 * @Last Modified by: MUHM
 * @Last Modified time: 2019-03-15 18:06:50
 */
'use strict';

module.exports = async app => {
  // const authorize = app.middlewares.authorize(app);
  const authorize = app.middlewares.authorize();
  const { router, controller, model } = app;

  router.get('/', controller.web.home.index);
  router.get('/tag/:id', controller.web.home.tag);

  router.get('/api/web/tag', controller.api.web.tag.index);
  router.get('/api/web/tag/:id', controller.api.web.tag.show);
  router.get('/api/web/post', controller.api.web.post.index);
  router.get('/api/web/site', controller.api.web.site.index);

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

  // 开放api
  router.post('/api/open/token', controller.api.token.create);
  router.put('/api/open/token/:access_token/:refresh_token', controller.api.token.update);
  router.del('/api/open/token/:access_token', controller.api.token.destroy);

};
