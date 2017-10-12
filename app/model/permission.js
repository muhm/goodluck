/*
 * @Author: MUHM
 * @Date: 2017-07-06 13:48:11
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 13:48:45
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Permission = app.model.define('permission', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    parent_id: {
      type: INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    name: STRING(150),
    link_url: STRING(150),
    // HTTP协议 get post put delete
    http_type: STRING(150),
    area: STRING(150),
    controller: STRING(150),
    action: STRING(150),
    icon: STRING(150),
    description: STRING(150),
    sort: INTEGER,
    is_menu: INTEGER,
    created_by: INTEGER,
    updated_by: INTEGER,
  });

  Permission.associate = () => {
    Permission.belongsToMany(app.model.Role, {
      through: {
        model: app.model.RolePermission,
        unique: false,
      },
      foreignKey: 'permission_id',
    });
  };

  return Permission;
};
