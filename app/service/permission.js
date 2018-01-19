/*
 * @Author: MUHM
 * @Date: 2018-01-11 13:01:13
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 15:18:09
 */
'use strict';

module.exports = app => {
  return class Permission extends app.Service {
    // list
    async findAllByPage(where, limit, offset) {
      return await this.ctx.model.Permission.findAndCountAll({
        where,
        limit,
        offset,
      });
    }
    // findAll
    async findAll(where) {
      return await this.ctx.model.Permission.findAll({
        where,
      });
    }
    /**
    * 获取用户菜单列表
    * @param {INTEGER} [user_id] - 用户id
    * @return {Promise} 菜单列表
    */
    async findUserMenu(user_id) {
      return await this.ctx.model.query('select a.id,a.parent_id,a.name,a.url,a.icon,a.controller,a.sort from permission  as a where a.deleted_at is null and a.is_menu=1 and a.id in (select permission_id from role_permission where deleted_at is null and role_id in (select role_id from role_user where deleted_at is null and user_id=:user_id)) order by sort asc;', {
        replacements: {
          user_id,
        },
        type: this.ctx.model.QueryTypes.SELECT,
      });
    }
  };
};
