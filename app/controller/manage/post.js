/*
 * @Author: MUHM
 * @Date: 2018-02-23 13:56:23
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-09 10:29:12
 */
'use strict';

module.exports = app => {
  class PostController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.locals.breadcrumbs = [{
        title: ctx.__('Post Management'),
      }];
      await ctx.render('manage/post/index');
    }
    async upsert() {
      const { ctx } = this;
      ctx.locals.breadcrumbs = [{
        title: ctx.__('Post Management'),
      }];
      await ctx.render('manage/post/upsert');
    }
  }

  return PostController;
};
