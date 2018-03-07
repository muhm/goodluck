/*
 * @Author: MUHM
 * @Date: 2018-01-11 11:10:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-07 15:54:36
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
        user.status = 1;
        user.register_ip = ctx.ip;
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
    async password() {
      const { ctx } = this;
      try {
        if (ctx.session.userId) {
          ctx.status = 401;
          ctx.body = { code: 401, msg: ctx.__('401 Unauthorized') };
          return;
        }
        const oldPwd = ctx.request.body.oldPwd;
        const newPwd = ctx.request.body.newPwd;
        const confirmPwd = ctx.request.body.confirmPwd;
        await ctx.service.user.updatePassword(ctx.session.userId, oldPwd, newPwd, confirmPwd);
        ctx.body = {
          code: 200,
          msg: ctx.__('Update success'),
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
        // ctx.body = user ? {
        //   code: 400,
        //   msg: '已存在',
        // } : true;
        ctx.body = user ? false : true;
      } catch (e) {
        ctx.body = false;
        // ctx.body = {
        //   code: 400,
        //   msg: e.message,
        // };
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
        // ctx.body = user ? {
        //   code: 400,
        //   msg: '已存在',
        // } : true;
        ctx.body = user ? false : true;
      } catch (e) {
        ctx.body = false;
        // ctx.body = {
        //   code: 400,
        //   msg: e.message,
        // };
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
