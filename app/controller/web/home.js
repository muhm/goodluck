/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:24:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-27 15:48:31
 */
'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.body = `hehe ${ctx.session.userId ? '200' : '401'}`;
    }
  }
  return HomeController;
};
