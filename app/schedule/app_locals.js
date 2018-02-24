/*
 * @Author: MUHM
 * @Date: 2018-02-24 15:52:07
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-24 15:59:40
 */
'use strict';
module.exports = app => {
  return {
    schedule: {
      // cron: '0 0 4 * * *', // 每天凌晨4:00执行一次
      interval: '1h',
      type: 'all', // all 指定所有的 worker 都需要执行 worker 随机一个 worker 执行
      // disable: app.config.env === 'local', // 本地开发环境不执行
    },
    async task(ctx) {
      try {
        const config = await ctx.model.Setting.findAll();
        if (config) {
          config.forEach(element => {
            app.locals[element.key] = element.value;
          }, this);
        }
        if (app.locals.cdn) {
          app.locals.web_assets = app.locals.cdn + app.locals.web_assets;
          app.locals.manage_assets = app.locals.cdn + app.locals.manage_assets;
        }
      } catch (e) {
        // console.log(e);
        // gshxd
      }
    },
  };
};
