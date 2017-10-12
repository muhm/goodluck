/*
 * @Author: MUHM
 * @Date: 2017-07-06 13:48:11
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 13:58:24
 */
'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const RolePermission = app.model.define('role_permission', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    role_id: INTEGER,
    permission_id: INTEGER,
  });

  return RolePermission;
};
