/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:24:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-24 10:54:18
 */
'use strict';

module.exports = app => {
  class TokenController extends app.Controller {
    // 生成token
    async create() {
      const { ctx } = this;
      const user = await ctx.service.user.login(ctx.query.account || ctx.request.body.account, ctx.query.password || ctx.request.body.password);
      const token = await ctx.service.token.create(user, ctx.locals.clinet);
      ctx.body = { code: 200, data: { user, token } };
    }
    // 更新token
    async update() {
      const { ctx } = this;
      const token = await ctx.service.token.update(ctx.params.access_token, ctx.params.refresh_token, ctx.locals.clinet);
      ctx.body = { code: 200, data: { token } };
    }
    // 删除token
    async destroy() {
      const { ctx } = this;
      const result = await ctx.service.token.destroy(ctx.params.access_token);
      ctx.body = { code: result ? 200 : 400 };
    }
  }
  return TokenController;
};
