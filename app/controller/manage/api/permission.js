/*
 * @Author: MUHM
 * @Date: 2018-01-12 09:34:36
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-27 17:06:51
 */
'use strict';

module.exports = app => {
  class PermissionController extends app.Controller {
    async index() {
      const { ctx } = this;
      const permissions = await ctx.service.permission.findAllByPage();
      ctx.body = {
        code: 200,
        data: permissions,
      };
    }
  }
  return PermissionController;
};
