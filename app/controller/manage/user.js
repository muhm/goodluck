/*
 * @Author: MUHM
 * @Date: 2017-07-12 15:18:54
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-01 14:55:32
 */
'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.locals.breadcrumbs = [{
        title: ctx.__(500000),
      }];
      await ctx.render('manage/user/index');
    }
  }

  return UserController;
};
