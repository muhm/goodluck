/*
 * @Author: MUHM
 * @Date: 2018-03-06 10:11:08
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 10:32:52
 */
'use strict';

module.exports = app => {
  return class Tag extends app.Service {
    constructor(ctx) {
      super(ctx);
      this.uuid = require('node-uuid');
      this.TagModel = ctx.model.Tag;
    }
    /**
    * 查询标签列表
    * @param {Object} [where] - 查询条件
    * @param {Integer} [limit] - limit
    * @param {Integer} [offset] - offset
    * @param {Array} [order] - order 默认[['created_at', 'DESC']]
    * @return {Promise} 标签列表
    */
    async findAllByPage(where, limit, offset, order = [['created_at', 'DESC']]) {
      const { TagModel } = this;
      return await TagModel.findAndCountAll({
        where,
        order,
        limit,
        offset,
      });
    }
  };
};
