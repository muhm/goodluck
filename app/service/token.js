/*
 * @Author: MUHM
 * @Date: 2017-10-12 16:23:18
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 16:55:17
 */
'use strict';

module.exports = app => {
  return class Token extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.uuid = require('node-uuid');
    }
    /**
     * 根据用户及客户端生成token
     * @param {User} [user] - 用户
     * @param {Client} [client] - 客户端
     * @return {Promise} token
     */
    async create(user, client) {
      const { ctx, uuid } = this;
      await ctx.model.Token.destroy({
        where: {
          user_id: user.id,
        },
      });
      return user.createToken({
        access_token: (uuid.v1()).replace(/-/g, ''),
        access_token_expires_at: ctx.locals.moment().add(client.access_token_lifetime, 'ms'),
        refresh_token: (uuid.v4()).replace(/-/g, ''),
        refresh_token_expires_at: ctx.locals.moment().add(client.access_token_lifetime, 'ms'),
        client_id: client.id,
      });
    }
    /**
     * 根据access_token及refresh_token刷新token
     * @param {String} [access_token] - access_token
     * @param {String} [refresh_token] - refresh_token
     * @param {Client} [client] - 客户端
     * @return {Promise} token
     */
    async update(access_token, refresh_token, client) {
      const { ctx, uuid } = this;
      const token = await ctx.model.Token.findOne({
        where: {
          access_token,
          refresh_token,
        },
      });
      if (!token) {
        throw new Error(ctx.__(200000));
      }
      if (token.refresh_token_expires_at < ctx.locals.moment()) {
        throw new Error(ctx.__(200001));
      }
      await token.update({
        access_token: (uuid.v1()).replace(/-/g, ''),
        access_token_expires_at: ctx.locals.moment().add(client.access_token_lifetime, 'ms'),
        refresh_token: (uuid.v4()).replace(/-/g, ''),
        refresh_token_expires_at: ctx.locals.moment().add(client.access_token_lifetime, 'ms'),
      });
      return token;
    }
    /**
     * 根据access_token删除token
     * @param {access_token} [access_token] - access_token
     * @return {Integer} 1或0
     */
    destroy(access_token) {
      return this.ctx.model.Token.destroy({
        where: {
          access_token,
        },
      });
    }
  };
};
