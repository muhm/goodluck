/*
 * @Author: MUHM
 * @Date: 2017-10-12 17:03:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-20 10:11:05
 */
'use strict';

module.exports = () => {
  return async (ctx, next) => {
    try {
      const uuid = ctx.query.uuid || ctx.request.body.uuid;
      const secret = ctx.query.secret || ctx.request.body.secret;
      const client = await ctx.service.client.findByUuidAndSecret(uuid, secret);
      if (client) {
        ctx.locals.client = client;
        await next();
      } else {
        ctx.body = { code: 401, msg: ctx.__('401 Unauthorized') };
      }
    } catch (e) {
      ctx.body = { code: 400, msg: e.message };
    }
  };
};
