/*
 * @Author: MUHM
 * @Date: 2018-01-12 13:37:22
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-22 10:04:42
 */
'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    async index() {
      const { ctx } = this;
      const limit = ctx.helper.getLimit();
      const offset = ctx.helper.getOffset();
      const users = await ctx.service.user.findAllByPage(null, limit, offset);
      const result = {
        code: 200,
        data: users.rows,
        recordsTotal: users.count,
        recordsFiltered: users.count,
        draw: ctx.query.draw,
      };

      ctx.body = result;
    }
    async show() {
      const { ctx } = this;
      const user = await ctx.service.user.findById(ctx.params.id);
      if (!user) {
        ctx.body = {
          code: 404,
          msg: ctx.__('404 Not found'),
        };
        return;
      }
      const roles = await user.getRoles();
      ctx.body = {
        code: 200,
        data: { user, roles },
      };
    }
    async create() {
      const { ctx } = this;
      const item = {
        name: ctx.request.body.name,
        truename: ctx.request.body.truename,
        status: 1,
        register_ip: ctx.ip,
        created_by: ctx.locals.user.id,
        password: ctx.locals.password_default,
      };
      await ctx.service.user.create(item);
      ctx.body = {
        code: 200,
        msg: ctx.__('Create success'),
      };
    }
    async update() {
      const { ctx } = this;
      const item = {
        id: ctx.request.body.id,
        truename: ctx.request.body.truename,
        email: ctx.request.body.email || null,
        status: ctx.request.body.status,
        updated_by: ctx.locals.user.id,
      };
      await ctx.service.user.updateUserAndRole(item, ctx.request.body.roles);
      ctx.body = {
        code: 200,
        msg: ctx.__('Update success'),
      };
    }
  }
  return UserController;
};
