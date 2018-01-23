/*
 * @Author: MUHM
 * @Date: 2017-07-06 13:48:11
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-23 13:51:28
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
    name: {
      type: STRING(150),
      comment: '名称',
    },
    description: {
      type: STRING(150),
      comment: '描述',
    },
    url: {
      type: STRING(150),
      comment: 'url',
    },
    method: {
      type: STRING(150),
      comment: 'HTTP协议 get post put delete',
    },
    area: {
      type: STRING(150),
      comment: 'area',
    },
    controller: {
      type: STRING(150),
      comment: 'controller',
    },
    action: {
      type: STRING(150),
      comment: 'action',
    },
    icon: {
      type: STRING(150),
      comment: 'icon',
    },
    sort: {
      type: INTEGER,
      comment: '排序-正序',
    },
    is_menu: {
      type: INTEGER,
      comment: '是否菜单',
    },
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
