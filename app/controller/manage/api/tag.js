/*
 * @Author: MUHM
 * @Date: 2018-02-27 16:57:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-27 17:06:22
 */
'use strict';

module.exports = app => {
  class TagController extends app.Controller {
    async index() {
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
  return TagController;
};
