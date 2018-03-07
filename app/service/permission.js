/*
 * @Author: MUHM
 * @Date: 2018-01-11 13:01:13
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-07 16:28:30
 */
'use strict';

module.exports = app => {
  return class Permission extends app.Service {
    /**
    * 查询权限列表
    * @param {Object} [where] - 查询条件
    * @param {Integer} [limit] - limit
    * @param {Integer} [offset] - offset
    * @param {Array} [order] - order 默认[['created_at', 'DESC']]
    * @return {Promise} 权限列表
    */
    findAllByPage(where, limit, offset, order = [['created_at', 'DESC']]) {
      return this.ctx.model.Permission.findAndCountAll({
        where,
        order,
        limit,
        offset,
      });
    }
    /**
    * 根据url,method,user_id查询是否有权限
    * @param {String} [url] - url
    * @param {String} [method] - method
    * @param {Integer} [user_id] - user_id
    * @return {Boolean} true/flase
    */
    async checkRole(url, method, user_id) {
      const count = await this.ctx.model.Permission.count({
        where: {
          url,
          method,
        },
        include: [{
          required: true,
          model: app.model.Role,
          include: [{
            required: true,
            where: {
              id: user_id,
            },
            model: app.model.User,
          }]
        }],
        distinct: true,
      });
      return count !== 0;
    }
    /**
    * 获取用户菜单列表
    * @param {Integer} [user_id] - 用户id
    * @return {Promise} 菜单列表
    */
    async findUserMenu(user_id) {
      return await this.ctx.model.Permission.findAll({
        attributes: ['id', 'parent_id', 'name', 'url', 'icon', 'controller', 'sort'],
        where: {
          is_menu: 1,
        },
        include: [{
          required: true,
          attributes: [],
          model: app.model.Role,
          include: [{
            required: true,
            where: {
              id: user_id,
            },
            attributes: [],
            model: app.model.User,
          }]
        }],
        distinct: true,
        order: [['sort', 'ASC']]
      });
    }
  };
};
