/*
 * @Author: MUHM
 * @Date: 2017-10-19 16:25:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-20 14:12:47
 */
'use strict';

module.exports = app => {
  return class User extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.crypto = require('crypto');
    }
    /**
     * 登录
     * @param {String} [username] - 账号
     * @param {String} [password] - 密码
     * @return {Promise} 用户
     */
    async login(username, password) {
      const { ctx, crypto } = this;
      const where = ctx.helper.accountWhere(username);
      if (!where) {
        // 账号格式有误
        throw new Error(ctx.__(100000));
      }
      // 根据账号查用户
      const user = await ctx.model.User.findOne(where);
      // 用户不存在
      if (!user) {
        throw new Error(ctx.__(100000));
      }
      // 检查用户状态
      if (user.status !== 'active') {
        throw new Error(ctx.__(100001));
      }
      // 检查登录错误次数
      if (user.login_fail_count > parseInt(app.locals.login_fail_count)) {
        throw new Error(ctx.__(100002));
      }
      // 检查用户密码
      if (user.password !== crypto.createHash('md5').update(password + app.locals.password_secret).digest('hex')) {
        // 增加密码输入错误次数
        await user.update({
          login_fail_count: user.login_fail_count + 1,
        });
        throw new Error(ctx.__(100000));
      }
      // 登录成功，重置密码输入错误次数，记录登录时间，增加登录次数
      await user.update({
        login_fail_count: 0,
        login_count: user.login_count + 1,
        last_login: ctx.locals.moment(),
      });
      return user;
    }
  };
};
