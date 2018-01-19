/*
 * @Author: MUHM
 * @Date: 2018-01-12 13:37:22
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 15:38:18
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
      ctx.body = 'show';
    }
    async create() {
      const { ctx } = this;
      ctx.body = {
        code: 200,
        msg: ctx.__(300001),
      };
    }
    async update() {
      const { ctx } = this;
      ctx.body = {
        code: 200,
        msg: ctx.__(300002),
      };
    }
    async destroy() {
      const { ctx } = this;
      ctx.body = {
        code: 200,
        msg: ctx.__(300003),
      };
    }
  }
  return UserController;
};
