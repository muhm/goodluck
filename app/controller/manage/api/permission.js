/*
 * @Author: MUHM
 * @Date: 2018-01-12 09:34:36
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 16:20:20
 */
'use strict';

module.exports = app => {
  class ApiMenuController extends app.Controller {
    async index() {
      const { ctx } = this;
      const permissions = await ctx.service.permission.findAllByPage();
      ctx.body = {
        code: 200,
        data: permissions,
      };
    }
  }
  return ApiMenuController;
};
