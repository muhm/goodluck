/*
 * @Author: MUHM
 * @Date: 2018-02-24 15:52:07
 * @Last Modified by: MUHM
 * @Last Modified time: 2019-03-15 22:07:40
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
          app.locals.site = {};
          config.forEach(element => {
            app.locals.site[element.key] = element.value;
          }, this);
        }
        if (app.locals.site.cdn) {
          app.locals.site.web_assets = app.locals.site.cdn + app.locals.site.web_assets;
          app.locals.site.manage_assets = app.locals.site.cdn + app.locals.site.manage_assets;
        }
      } catch (e) {
        // console.log(e);
        // gshxd
      }
    },
  };
};
