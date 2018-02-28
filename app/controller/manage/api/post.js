/*
 * @Author: MUHM
 * @Date: 2018-02-27 16:57:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-28 15:10:29
 */
'use strict';

module.exports = app => {
  class PostController extends app.Controller {
    async index() {
      const { ctx } = this;
      const limit = ctx.helper.getLimit();
      const offset = ctx.helper.getOffset();
      await ctx.service.post.create(null);
      const posts = await ctx.service.post.findAllByPage(null, limit, offset);

      ctx.body = {
        code: 200,
        data: posts.rows,
        recordsTotal: posts.count,
        recordsFiltered: posts.count,
        draw: ctx.query.draw,
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
