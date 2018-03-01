/*
 * @Author: MUHM
 * @Date: 2018-02-27 16:57:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-01 09:15:07
 */
'use strict';

module.exports = app => {
  class PostController extends app.Controller {
    async index() {
      const { ctx } = this;
      const limit = ctx.helper.getLimit();
      const offset = ctx.helper.getOffset();
      const posts = await ctx.service.post.findAllByPage(null, limit, offset);

      ctx.body = {
        code: 200,
        data: posts.rows,
        recordsTotal: posts.count,
        recordsFiltered: posts.count,
        draw: ctx.query.draw,
        totalPage: parseInt((posts.count + limit - 1) / limit),
        pageIndex: parseInt(offset / limit) + 1 > 0 ? parseInt(offset / limit) + 1 : 1,
      };
    }
    async author() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
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
  return PostController;
};
