/*
 * @Author: MUHM
 * @Date: 2018-01-18 14:41:41
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 17:14:49
 */
'use strict';

module.exports = () => {
  return async (ctx, next) => {
    // console.log(ctx._matchedRoute);
    const api = /^\/manage\/api.*$/.test(ctx._matchedRoute);
    if (!ctx.session.userId) {
      api ? ctx.body = {
        code: 401,
        msg: '401 Unauthorized',
      } : ctx.redirect(`/account/login?redirectURL=${ctx.originalUrl}`);
      return;
    }
    // 重复登录验证
    const user = await ctx.service.user.findById(ctx.session.userId);
    if (user.session_token !== ctx.session.token) {
      ctx.session.userId = null;
      ctx.session.token = null;
      return ctx.redirect(`/login?redirectURL=${ctx.originalUrl}&message=账号在别处登录,请确保您的账号安全`);
    }
    ctx.locals.username = user.truename ? user.truename : user.name;
    ctx.locals.user = user;
    await next();
  };
};
