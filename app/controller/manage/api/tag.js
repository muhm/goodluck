/*
 * @Author: MUHM
 * @Date: 2018-02-27 16:57:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-06 10:25:36
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
      ctx.body = ctx.locals.moment();
    }
    async create() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
    }
    async update() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
    }
    async destroy() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
    }
  }
  return TagController;
};
