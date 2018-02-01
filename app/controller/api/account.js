/*
 * @Author: MUHM
 * @Date: 2018-01-11 11:10:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-01 16:41:59
 */
'use strict';

module.exports = app => {
  class AccountController extends app.Controller {
    async login() {
      const { ctx } = this;
      try {
        const url = ctx.query.redirectURL;
        const name = ctx.request.body.name;
        const password = ctx.request.body.password;
        const user = await ctx.service.user.login(name, password);
        const roles = await user.getRoles();
        const data = { url: url !== '/' ? url : roles.length > 0 ? '/manage/home' : '/' };
        // todo
        ctx.session.userId = user.id;
        ctx.session.name = user.name;
        ctx.session.token = user.session_token;
        ctx.rotateCsrfSecret();

        ctx.body = {
          code: 200,
          data,
          msg: ctx.__('Login success'),
        };
      } catch (e) {
        ctx.body = {
          code: 400,
          msg: e.message,
        };
      }
    }
    async register() {
      const { ctx } = this;
      try {
        const user = ctx.request.body;
        await ctx.service.user.create(user);
        ctx.body = {
          code: 200,
          msg: ctx.__('Register success'),
        };
      } catch (e) {
        ctx.body = {
          code: 400,
          msg: e.message,
        };
      }
    }
    async name() {
      const { ctx } = this;
      try {
        const name = ctx.query.name;
        if (!ctx.helper.isUserName(name)) {
          throw new Error('非法账号');
        }
        const user = await ctx.service.user.findByAccount(name);
        ctx.body = user ? {
          code: 400,
          msg: '已存在',
        } : true;
      } catch (e) {
        ctx.body = {
          code: 400,
          msg: e.message,
        };
      }
    }
    async email() {
      const { ctx } = this;
      try {
        const email = ctx.query.email;
        if (!ctx.helper.isEmail(email)) {
          throw new Error('非法电子邮箱');
        }
        const user = await ctx.service.user.findByAccount(email);
        ctx.body = user ? {
          code: 400,
          msg: '已存在',
        } : true;
      } catch (e) {
        ctx.body = {
          code: 400,
          msg: e.message,
        };
      }
    }
    async mobile() {
      const { ctx } = this;
      try {
        const mobile = ctx.query.mobile;
        if (!ctx.helper.isMobile(mobile)) {
          throw new Error('非法手机号');
        }
        const user = await ctx.service.user.findByAccount(mobile);
        ctx.body = user ? {
          code: 400,
          msg: '已存在',
        } : true;
      } catch (e) {
        ctx.body = {
          code: 400,
          msg: e.message,
        };
      }
    }
  }
  return AccountController;
};
