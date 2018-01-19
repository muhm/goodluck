/*
 * @Author: MUHM
 * @Date: 2018-01-12 09:27:38
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 17:24:10
 */
'use strict';

module.exports = app => {
  return class Role extends app.Service {
    /**
    * 查询角色列表
    * @param {Object} [where] - 查询条件
    * @param {Integer} [limit] - limit
    * @param {Integer} [offset] - offset
    * @param {Array} [order] - order 默认[['created_at', 'DESC']]
    * @return {Promise} 角色列表
    */
    findAllByPage(where, limit, offset, order = [['created_at', 'DESC']]) {
      return this.ctx.model.Role.findAndCountAll({
        where,
        order,
        limit,
        offset,
      });
    }
    // find all
    findAll() {
      return this.ctx.model.Role.findAll();
    }
    // find user's all role
    findAllToUser() {
      return this.ctx.model.Role.findAll({
        raw: true,
        attributes: ['id', 'name'],
      });
    }
    /**
    * 根据id查询角色
    * @param {Integer} [id] - 角色id
    * @return {Promise} 角色
    */
    findById(id) {
      return this.ctx.model.Role.findById(id);
    }
    /**
    * 新增角色
    * @param {Object} [m] - 角色信息
    * @return {Promise} 角色
    */
    create(m) {
      return this.ctx.model.Role.create(m);
    }
    /**
    * 修改角色
    * @param {Object} [m] - 角色信息
    * @param {Array} [p] - 权限信息
    * @return {Promise} 角色
    */
    async update(m, p) {
      const t = await app.model.transaction();
      try {
        const role = await this.ctx.service.role.findById(m.id);
        if (!role) {
          throw new Error('角色不存在');
        }
        await role.update(m, { transaction: t });
        const permissions = await role.getPermissions();
        await role.removePermissions(permissions, { transaction: t });
        await role.setPermissions(p, { transaction: t });

        return t.commit();
      } catch (e) {
        await t.rollback();
        throw new Error(e.message);
      }
    }
  };
};
