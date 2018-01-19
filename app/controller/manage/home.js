/*
 * @Author: MUHM
 * @Date: 2018-01-11 09:27:25
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-18 14:12:56
 */
'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      await ctx.render('manage/home/index');
    }
  }
  return HomeController;
};
