/*
 * @Author: MUHM
 * @Date: 2018-01-11 11:10:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 11:19:02
 */
'use strict';

module.exports = app => {
  class PostController extends app.Controller {
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
        ctx.body = {
          code: 400,
          msg: e.message,
        };
      }
    }
  }
  return PostController;
};
