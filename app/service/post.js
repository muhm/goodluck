/*
 * @Author: MUHM
 * @Date: 2018-02-28 11:21:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-28 16:16:12
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
      const { PostModel, TagModel, UserModel, PostStatisticsModel } = this;
      const result = {
        rows: await PostModel.findAll({
          where,
          include: [{
            attributes: ['name', 'slug'],
            model: TagModel,
          }, {
            attributes: ['name', 'truename'],
            as: 'author',
            model: UserModel,
          }, {
            attributes: ['comment', 'hit', 'like', 'fuck'],
            model: PostStatisticsModel,
          }],
          order,
          limit,
          offset,
        }),
        count: await PostModel.count({ where }),
      };
      return result;
    }
    /**
    * 新增文章
    * @param {Object} [post] 文章
    * @param {Object} [tags] 新增标签
    * @return {Promise} 文章
    */
    async create(post, tags) {
      const { PostModel, PostStatisticsModel, TagModel } = this;
      post = {
        slug: Date.now().toString(),
        post_statistic: {},
        tags: tags || [
          { slug: Date.now().toString() },
        ],
      };
      const result = await PostModel.create(post, { include: [PostStatisticsModel, TagModel] });
      return result;
    }
  };
};
