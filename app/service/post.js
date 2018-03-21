/*
 * @Author: MUHM
 * @Date: 2018-02-28 11:21:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-21 16:48:32
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
          through: {
            attributes: [],
          },
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
        result.rows[i].plaintext = ctx.helper.getExcerpt(result.rows[i].plaintext || '');
      }
      return result;
    }
    /**
    * 编辑文章
    * @param {Object} [post] 文章
    * @return {Promise} 文章
    */
    async upsert(post) {
      const { ctx, PostModel, PostStatisticsModel, uuid } = this;
      const t = await app.model.transaction();
      let id;
      try {
        post.updated_by = ctx.locals.user.id;
        post.plaintext = post['editormd-post-markdown-doc'];
        post.html = post['editormd-post--html-code'];
        post.slug = ctx.helper.safeUrl(post.slug || post.title);
        post.title = post.title.trim();
        if (post.id) {
          const oldPost = await PostModel.findById(post.id);
          if (!oldPost) {
            throw new Error(ctx.__('Post not found'));
          }
          while (post.slug) {
            // 因为slug有唯一约束，所以加上paranoid: false,查询的数据包含软删除数据
            const isExist = await PostModel.findOne({ where: { slug: post.slug }, paranoid: false });
            if (!isExist || isExist.id === oldPost.id) {
              break;
            }
            post.slug += uuid.v1();
          }
          post.status = oldPost.status; // 禁止修改Post状态
          oldPost.update(post, { transaction: t });
          const oldTags = await oldPost.getTags();
          await oldPost.removeTags(oldTags, { transaction: t });
          await oldPost.setTags(post.tags, { transaction: t });
          id = oldPost.id;
        } else {
          post.id = uuid.v1();
          post.author = ctx.locals.user.id;
          post.created_by = ctx.locals.user.id;
          post.status = 0;
          post.post_statistic = {};
          if (!post.slug) {
            post.slug = ctx.helper.safeUrl(post.title);
          }
          while (post.slug) {
            // 因为slug有唯一约束，所以加上paranoid: false,查询的数据包含软删除数据
            const isExist = await PostModel.findOne({ where: { slug: post.slug }, paranoid: false });
            if (!isExist) {
              break;
            }
            post.slug += uuid.v1();
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
    /**
     * 根据id删除post
     * @param {Integer} [id] - id
     * @return {Integer} 1或0
     */
    async destroy(id) {
      const { PostModel } = this;
      return await PostModel.destroy({
        where: {
          id,
        },
      });
    }
    async publish(id) {
      const { PostModel, ctx } = this;
      return await PostModel.update({ status: 1, published_by: ctx.locals.user.id, published_at: ctx.locals.moment() }, { where: { id } });
    }
    async retract(id) {
      const { PostModel } = this;
      return await PostModel.update({ status: 0 }, { where: { id } });
    }
  };
};
