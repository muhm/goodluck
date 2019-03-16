/*
 * @Author: MUHM
 * @Date: 2017-10-19 16:25:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2019-03-15 21:39:16
 */
'use strict';

module.exports = app => {
  return class User extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.password_secret = app.config.password_secret;
      this.crypto = require('crypto');
      this.uuid = require('node-uuid');
      this.UserModel = ctx.model.User;
    }
    /**
    * 新增用户
    * @param {Object} [m] - 用户信息(用户信息中的password请勿加密)
    * @return {Promise} 用户
    */
    async create(m) {
      const { UserModel, crypto, password_secret, ctx } = this;
      m.password = crypto.createHash('md5').update(m.password + password_secret).digest('hex');
      if (!ctx.helper.isUserName(m.name)) {
        throw new Error(ctx.__('Incorrect username'));
      }
      if (m.email) {
        if (!ctx.helper.isEmail(m.email)) {
          throw new Error(ctx.__('Email validate error'));
        }
        const isExist = await UserModel.findOne({ where: { email: m.email } });
        if (isExist) {
          throw new Error(ctx.__('Email validate error'));
        }
      }
      return await UserModel.create(m);
    }
    /**
    * 修改用户及角色
    * @param {Object} [m] - 角色信息
    * @param {Array} [r] - 角色信息
    * @return {Promise} 用户
    */
    async updateUserAndRole(m, r) {
      const { ctx, UserModel } = this;
      const t = await app.model.transaction();
      try {
        const user = await ctx.service.user.findById(m.id);
        if (!user) {
          throw new Error(ctx.__('User not found'));
        }
        if (m.email && user.email !== m.email) {
          const isExist = await UserModel.findOne({ where: { email: m.email } });
          if (isExist) {
            throw new Error(ctx.__('Email validate error'));
          }
        }
        await user.update(m, { transaction: t });
        const roles = await user.getRoles();
        await user.removeRoles(roles, { transaction: t });
        await user.setRoles(r, { transaction: t });

        return await t.commit();
      } catch (e) {
        await t.rollback();
        throw new Error(e.message);
      }
    }
    /**
     * 登录
     * @param {String} [username] - 账号
     * @param {String} [password] - 密码
     * @return {Promise} 用户
     */
    async login(username, password) {
      const { ctx, crypto, uuid, password_secret } = this;
      const where = ctx.helper.accountWhere(username);
      if (!where) {
        // 账号格式有误
        throw new Error(ctx.__('Incorrect username'));
      }
      // 根据账号查用户
      const user = await ctx.model.User.findOne({ where });
      // 用户不存在
      if (!user) {
        throw new Error(ctx.__('User not found'));
      }
      // 检查用户状态
      if (user.status !== 1) {
        throw new Error(ctx.__('Account is not available'));
      }
      // 检查登录错误次数
      if (user.login_fail_count > parseInt(app.locals.site.login_fail_count)) {
        throw new Error(ctx.__('Too many password errors logins to this has been disabled'));
      }
      // 检查用户密码
      if (user.password !== crypto.createHash('md5').update(password + password_secret).digest('hex')) {
        // 增加密码输入错误次数
        await user.update({
          login_fail_count: user.login_fail_count + 1,
        });
        throw new Error(ctx.__('Incorrect password'));
      }
      const session_token = uuid.v1();
      // 登录成功，重置密码输入错误次数，记录登录时间，增加登录次数
      await user.update({
        login_fail_count: 0,
        login_count: user.login_count + 1,
        session_token,
        last_login: ctx.locals.moment(),
      });
      return user;
    }
    /**
     * 查询用户列表
     * @param {Object} [where] - 查询条件
     * @param {Integer} [limit] - limit
     * @param {Integer} [offset] - offset
     * @param {Array} [order] - order 默认[['created_at', 'DESC']]
     * @return {Promise} 用户列表
     */
    async findAllByPage(where, limit, offset, order = [['created_at', 'DESC']]) {
      const { UserModel } = this;
      return await UserModel.findAndCountAll({
        where,
        include: [{
          attributes: ['name'],
          model: app.model.Role,
        }],
        distinct: true,
        order,
        limit,
        offset,
      });
    }
    /**
     * 根据账号查找
     * @param {String} [account] - 账号
     * @return {Promise} 用户
     */
    async findByAccount(account) {
      const { ctx } = this;
      const where = ctx.helper.accountWhere(account);
      if (!where) {
        // 账号格式有误
        throw new Error(ctx.__('Incorrect username'));
      }
      return await ctx.model.User.findOne({ where });
    }
    /**
     * 根据id查找
     * @param {Integer} [id] - 账号
     * @return {Promise} 用户
     */
    async findById(id) {
      const { UserModel } = this;
      return await UserModel.findById(id);
    }
    /**
     * 根据id修改密码
     * @param {Integer} [id] - 账号
     * @param {String} [oldPwd] - oldPwd
     * @param {String} [newPwd] - newPwd
     * @param {String} [confirmPwd] - confirmPwd
     * @return {Promise} 用户
     */
    async updatePassword(id, oldPwd, newPwd, confirmPwd) {
      const { ctx, crypto, UserModel, password_secret } = this;
      const user = await UserModel.findById(id);
      if (confirmPwd !== newPwd || newPwd === null || newPwd === '') {
        throw new Error(ctx.__('The two passwords differ'));
      }
      if (crypto.createHash('md5').update(oldPwd + password_secret).digest('hex') !== user.password) {
        throw new Error(ctx.__('Incorrect password'));
      }
      await user.update({
        password: crypto.createHash('md5').update(newPwd + password_secret).digest('hex'),
      });
      return user;
    }
  };
};
