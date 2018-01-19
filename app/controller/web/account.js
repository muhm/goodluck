/*
 * @Author: MUHM
 * @Date: 2018-01-11 11:10:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 16:47:54
 */
'use strict';

module.exports = app => {
  class AccountController extends app.Controller {
    async login() {
      const { ctx } = this;
      if (ctx.session.userId) {
        return ctx.redirect('/');
      }
      await ctx.render('web/account/login', {
        redirectURL: ctx.query.redirectURL ? ctx.query.redirectURL : '/',
      });
    }
    async register() {
      const { ctx } = this;
      await ctx.render('web/account/register');
    }
    async logout() {
      const { ctx } = this;
      ctx.session = null;
      await ctx.redirect('/');
    }
  }
  return AccountController;
};
