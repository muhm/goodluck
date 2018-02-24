/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:24:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-24 16:06:45
 */
'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.body = 'hehe 404';
    }
  }
  return HomeController;
};
