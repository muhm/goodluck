/*
 * @Author: MUHM
 * @Date: 2017-07-06 13:48:11
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-23 13:51:32
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Role = app.model.define('role', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    name: STRING(150),
    description: STRING(150),
    created_by: INTEGER,
    updated_by: INTEGER,
  });

  Role.associate = () => {
    Role.belongsToMany(app.model.User, {
      through: {
        model: app.model.RoleUser,
        unique: false,
      },
      foreignKey: 'role_id',
    });
    Role.belongsToMany(app.model.Permission, {
      through: {
        model: app.model.RolePermission,
        unique: false,
      },
      foreignKey: 'role_id',
    });
  };

  return Role;
};
