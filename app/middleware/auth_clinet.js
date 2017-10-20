/*
 * @Author: MUHM
 * @Date: 2017-10-12 17:03:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-20 14:56:52
 */
'use strict';

// module.exports = (options, app) => {
module.exports = () => {
  return async (ctx, next) => {
    try {
      const uuid = ctx.query.uuid || ctx.request.body.uuid;
      const secret = ctx.query.secret || ctx.request.body.secret;
      const clinet = await ctx.service.clinet.findByUuidAndSecret(uuid, secret);
      if (clinet) {
        ctx.locals.clinet = clinet;
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
