/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:24:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 15:56:22
 */
'use strict';

module.exports = app => {
  class TokenController extends app.Controller {
    async create() {
      const { ctx } = this;
      const uuid = ctx.query.uuid || ctx.request.body.uuid;
      const secret = ctx.query.secret || ctx.request.body.secret;
      const name = ctx.query.name || ctx.request.body.name;
      const password = ctx.query.password || ctx.request.body.password;
      ctx.body = ctx.locals.moment();
    }
  }
  return TokenController;
};
