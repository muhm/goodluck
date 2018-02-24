/*
 * @Author: MUHM
 * @Date: 2018-02-24 16:45:56
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-24 16:46:21
 */
'use strict';

module.exports = app => {
  return class Setting extends app.Service {
    /**
    * 查询网站配置
    * @param {Object} [where] - 查询条件
    * @param {Integer} [limit] - limit
    * @param {Integer} [offset] - offset
    * @param {Array} [order] - order 默认[['created_at', 'DESC']]
    * @return {Promise} 网站配置列表
    */
    findAllByPage(where, limit, offset, order = [['created_at', 'DESC']]) {
      return this.ctx.model.Setting.findAndCountAll({
        where,
        order,
        limit,
        offset,
      });
    }
  };
};
