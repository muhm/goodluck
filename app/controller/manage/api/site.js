/*
 * @Author: MUHM
 * @Date: 2018-01-12 13:37:22
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-24 16:48:10
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
    async update() {
      const { ctx } = this;
      ctx.body = {
        code: 200,
        msg: ctx.__('Update success'),
      };
    }
  }
  return SiteController;
};
