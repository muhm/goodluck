/*
 * @Author: MUHM
 * @Date: 2018-02-27 16:57:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-21 15:16:08
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
        throw new Error(ctx.__('404 Not found'));
      }
      ctx.body = {
        code: 200,
        data: tag,
      };
    }
    async create() {
      const { ctx } = this;
      const item = {
        name: ctx.request.body.name,
        description: ctx.request.body.description,
        created_by: ctx.locals.user.id,
      };
      const tag = await ctx.service.tag.create(item);
      ctx.body = {
        code: 200,
        data: tag,
        msg: ctx.__('Create success'),
      };
    }
    async update() {
      const { ctx } = this;
      // const item = {
      //   id: ctx.request.body.id,
      //   name: ctx.request.body.name,
      //   description: ctx.request.body.description,
      //   updated_by: ctx.locals.user.id,
      // };
      // await ctx.service.role.update(item);
      ctx.body = {
        code: 200,
        msg: ctx.__('Update success'),
      };
    }
    async destroy() {
      const { ctx } = this;
      const result = await ctx.service.tag.destroy(ctx.params.id);
      ctx.body = result === 1 ? { code: 200, msg: ctx.__('Destroy success') } : { code: 400, msg: ctx.__('Destroy fail') };
    }
  }
  return TagController;
};
