/*
 * @Author: MUHM
 * @Date: 2018-01-12 09:34:36
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-27 17:06:39
 */
'use strict';

module.exports = app => {
  class MenuController extends app.Controller {
    async index() {
      const { ctx } = this;
      const permissions = await ctx.service.permission.findUserMenu(ctx.session.userId);
      ctx.body = {
        code: 200,
        data: permissions,
      };
    }
  }
  return MenuController;
};
