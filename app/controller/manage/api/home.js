/*
 * @Author: MUHM
 * @Date: 2018-01-11 09:27:25
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-17 15:04:51
 */
'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
    }
  }
  return HomeController;
};
