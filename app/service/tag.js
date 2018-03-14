/*
 * @Author: MUHM
 * @Date: 2018-03-06 10:11:08
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 14:00:03
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

    /**
     * 根据id查询tag
     * @param {Integer} [id] - 角色id
     * @return {Promise} tag
     */
    async findById(id) {
      const { TagModel } = this;
      return await TagModel.findById(id);
    }
    /**
     * 新增tag
     * @param {Object} [m] - tag信息
     * @return {Promise} tag
     */
    async create(m) {
      const { ctx, TagModel, uuid } = this;
      const isExistWithName = await TagModel.findOne({ where: { name: m.name } });
      // 如果存在则更新
      if (isExistWithName) {
        throw new Error(ctx.__('Tag is exist'));
        // m.updated_by = m.created_by;
        // m.created_by = isExistWithName.created_by;
        // return await isExistWithName.update(m);
      }
      m.slug = m.slug || ctx.helper.safeUrl(m.name);
      while (m.slug) {
        // 因为slug有唯一约束，所以加上paranoid: false,查询的数据包含软删除数据
        const isExist = await TagModel.findOne({ where: { slug: m.slug }, paranoid: false });
        if (!isExist) {
          break;
        }
        m.slug += `/${uuid.v1()}`;
      }
      return await TagModel.create(m);
    }
    /**
     * 根据id删除tag
     * @param {Integer} [id] - id
     * @return {Integer} 1或0
     */
    async destroy(id) {
      const { TagModel } = this;
      return await TagModel.destroy({
        where: {
          id,
        },
      });
    }
  };
};
