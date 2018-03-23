/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:24:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-23 17:22:13
 */
'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      const { ctx } = this;
      await ctx.render('web/index');
    }
    async tag() {
      const { ctx } = this;
      await ctx.render('web/tag');
    }
    async post() {
      const { ctx } = this;
      const slug = ctx.params.slug;
      const post = await ctx.service.post.findBySlug(slug);
      await ctx.render('web/post', {
        post,
      });
    }
  }
  return HomeController;
};
