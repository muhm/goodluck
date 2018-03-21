/*
 * @Author: MUHM
 * @Date: 2018-02-27 16:57:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-21 16:49:48
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
    async show() {
      const { ctx } = this;
      const post = await ctx.service.post.findById(ctx.params.id);
      if (!post) {
        // ctx.status = 404;
        ctx.body = {
          code: 404,
          msg: ctx.__('404 Not found'),
        };
        return;
      }
      ctx.body = {
        code: 200,
        data: post,
      };
    }
    async create() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
    }
    async update() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
    }
    async upsert() {
      const { ctx } = this;
      const id = await ctx.service.post.upsert(ctx.request.body);
      ctx.body = {
        code: 200,
        data: id,
        msg: ctx.__('Success'),
      };
    }
    async destroy() {
      const { ctx } = this;
      const result = await ctx.service.post.destroy(ctx.params.id);
      ctx.body = result === 1 ? { code: 200, msg: ctx.__('Destroy success') } : { code: 400, msg: ctx.__('Destroy fail') };
    }
    async slug() {
      const { ctx } = this;
      try {
        const id = ctx.query.id;
        const slug = ctx.helper.safeUrl(ctx.query.slug);
        // 因为slug有唯一约束，所以加上paranoid: false,查询的数据包含软删除数据
        const post = await ctx.model.Post.findOne({ where: { slug }, paranoid: false });
        if (post) {
          ctx.body = post.id === id;
        } else {
          ctx.body = true;
        }
      } catch (e) {
        ctx.body = false;
      }
    }
    async publish() {
      const { ctx } = this;
      const result = await ctx.service.post.publish(ctx.request.body.id);
      ctx.body = result[0] === 1 ? { code: 200, msg: ctx.__('Publish success') } : { code: 400, msg: ctx.__('Publish fail') };
    }
    async retract() {
      const { ctx } = this;
      const result = await ctx.service.post.retract(ctx.request.body.id);
      ctx.body = result[0] === 1 ? { code: 200, msg: ctx.__('Retract success') } : { code: 400, msg: ctx.__('Retract fail') };
    }
  }
  return PostController;
};
