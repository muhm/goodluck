/*
 * @Author: MUHM
 * @Date: 2017-07-12 15:18:54
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-18 14:31:50
 */
'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.locals.breadcrumbs = [{
        title: '用户管理',
      }];
      await ctx.render('manage/user/index');
    }
  }

  return UserController;
};
