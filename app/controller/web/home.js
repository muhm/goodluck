/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:24:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-07 16:01:51
 */
'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.body = `hehe ${ctx.session.userId ? '200' : '401'}`;
      // ctx.body=await ctx.service.permission.test();
    }
  }
  return HomeController;
};
