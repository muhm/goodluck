/*
 * @Author: MUHM
 * @Date: 2017-10-12 17:03:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-18 13:56:01
 */
'use strict';

// module.exports = (options, app) => {
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
        ctx.status = 401;
        ctx.body = { code: 401, msg: '401 Unauthorized' };
      }
    } catch (e) {
      ctx.body = { code: 400, msg: e.message };
    }
  };
};
