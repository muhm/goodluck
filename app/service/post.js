/*
 * @Author: MUHM
 * @Date: 2018-02-28 11:21:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-13 17:27:31
 */
'use strict';

module.exports = app => {
  return class Post extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.uuid = require('node-uuid');
      this.PostModel = ctx.model.Post;
      this.TagModel = ctx.model.Tag;
      this.UserModel = ctx.model.User;
      this.PostStatisticsModel = ctx.model.PostStatistics;
    }
    /**
    * 查询文章列表
    * @param {Object} [where] - 查询条件
    * @param {Integer} [limit] - limit
    * @param {Integer} [offset] - offset
    * @param {Array} [order] - order 默认[['created_at', 'DESC']]
    * @return {Promise} 文章列表
    */
    async findAllByPage(where, limit, offset, order = [['created_at', 'DESC']]) {
      const { ctx, PostModel, TagModel, UserModel, PostStatisticsModel } = this;
      const result = await PostModel.findAndCountAll({
        attributes: ['id', 'slug', 'title', 'status', 'plaintext', 'author_id', 'created_at'],
        where,
        include: [{
          attributes: ['name', 'slug'],
          model: TagModel,
        }, {
          attributes: ['name', 'truename'],
          as: 'author',
          model: UserModel,
        }, {
          attributes: ['comment', 'view', 'like', 'fuck'],
          model: PostStatisticsModel,
        }],
        distinct: true,
        order,
        limit,
        offset,
      });
      for (const i in result.rows) {
        result.rows[i].plaintext = ctx.helper.getExcerpt(result.rows[i].plaintext || '', { words: 30 });
      }
      return result;
    }
    /**
    * 编辑文章
    * @param {Object} [post] 文章
    * @return {Promise} 文章
    */
    async upsert(post) {
      const { ctx, PostModel, PostStatisticsModel, TagModel, uuid } = this;
      const t = await app.model.transaction();
      let id;
      try {
        post.updated_by = ctx.locals.user.id;
        post.plaintext = post['editormd-post-markdown-doc'];
        post.html = post['editormd-post--html-code']
        if (post.id) {
          const oldPost = await PostModel.findById(post.id);
          if (!post) {
            throw new Error(ctx.__('Post not found'));
          }
          oldPost.update(post, { transaction: t });
          const oldTags = await oldPost.getTags();
          await oldPost.removeTags(oldTags, { transaction: t });
          await oldPost.setTags(post.tags, { transaction: t });
          id = oldPost.id;
        } else {
          post.id = uuid.v1();
          post.author = ctx.locals.user.id;
          post.created_by = ctx.locals.user.id;
          post.post_statistic = {};
          if (!post.slug) {
            post.slug = post.id;
          }
          const newPost = await PostModel.create(post, { include: [PostStatisticsModel], transaction: t });
          await newPost.setTags(post.tags, { transaction: t });
          id = newPost.id;
        }
        await t.commit();
        return id;
      } catch (e) {
        await t.rollback();
        throw new Error(e.message);
      }
    }
    /**
    * 根据id查询文章
    * @param {String} [id] 文章
    * @return {Promise} 文章
    */
    async findById(id) {
      const { PostModel, TagModel, UserModel, PostStatisticsModel } = this;
      return await PostModel.findById(id, {
        include: [{
          attributes: ['id', 'name', 'slug'],
          model: TagModel,
        }, {
          attributes: ['name', 'truename'],
          as: 'author',
          model: UserModel,
        }, {
          attributes: ['comment', 'view', 'like', 'fuck'],
          model: PostStatisticsModel,
        }],
      });
    }
  };
};
