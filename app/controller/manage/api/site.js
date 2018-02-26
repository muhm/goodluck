/*
 * @Author: MUHM
 * @Date: 2018-01-12 13:37:22
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-26 15:45:50
 */
'use strict';

module.exports = app => {
  class SiteController extends app.Controller {
    async index() {
      const { ctx } = this;
      const limit = ctx.helper.getLimit();
      const offset = ctx.helper.getOffset();
      const settings = await ctx.service.setting.findAllByPage(null, limit, offset);
      const result = {
        code: 200,
        data: settings.rows,
        recordsTotal: settings.count,
        recordsFiltered: settings.count,
        draw: ctx.query.draw,
      };

      ctx.body = result;
    }
    async show() {
      const { ctx } = this;
      const setting = await ctx.service.setting.findById(ctx.params.id);
      if (!setting) {
        throw new Error(ctx.__('404 Not found'));
      }
      ctx.body = {
        code: 200,
        data: setting,
      };
    }
    async update() {
      const { ctx } = this;
      await ctx.service.setting.update(ctx.request.body.id,ctx.request.body.value);
      ctx.body = {
        code: 200,
        msg: ctx.__('Update success'),
      };
    }
  }
  return SiteController;
};
