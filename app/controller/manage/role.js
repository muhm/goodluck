/*
 * @Author: MUHM
 * @Date: 2017-07-12 15:18:54
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-01 16:19:44
 */
'use strict';

module.exports = app => {
  class RoleController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.locals.breadcrumbs = [{
        title: ctx.__('Role Management'),
      }];
      await ctx.render('manage/role/index');
    }
  }

  return RoleController;
};
