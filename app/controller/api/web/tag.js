/*
 * @Author: MUHM
 * @Date: 2019-03-15 17:53:29
 * @Last Modified by: MUHM
 * @Last Modified time: 2019-03-15 17:53:29
 */
'use strict';

module.exports = app => {
  class TagController extends app.Controller {
    async index() {
      const { ctx } = this;
      const limit = ctx.helper.getLimit();
      const offset = ctx.helper.getOffset();
      const tags = await ctx.service.tag.findAllByPage(null, limit, offset);

      ctx.body = {
        code: 200,
        data: tags.rows,
        recordsTotal: tags.count,
        recordsFiltered: tags.count,
        draw: ctx.query.draw,
        totalPage: parseInt((tags.count + limit - 1) / limit),
        pageIndex: parseInt(offset / limit) + 1 > 0 ? parseInt(offset / limit) + 1 : 1,
      };
    }
    async show() {
      const { ctx } = this;
      const tag = await ctx.service.tag.findById(ctx.params.id);
      if (!tag) {
        ctx.body = {
          code: 404,
          msg: ctx.__('404 Not found'),
        };
        return;
      }
      ctx.body = {
        code: 200,
        data: tag,
      };
    }
  }
  return TagController;
};
