/*
 * @Author: MUHM
 * @Date: 2017-07-06 13:48:11
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-20 14:25:00
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    name: {
      unique: true,
      type: STRING(200),
    },
    truename: {
      type: STRING(200),
    },
    password: {
      type: STRING(60),
    },
    email: {
      unique: true,
      type: STRING(200),
      validate: {
        isEmail: true,
      },
    },
    is_verify_email: INTEGER,
    phone: {
      unique: true,
      type: STRING(20),
    },
    is_verify_phone: INTEGER,
    status: STRING(150),
    last_login: DATE,
    login_count: {
      type: INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    login_fail_count: {
      type: INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    // session_token: {
    //   type: UUID,
    //   defaultValue: UUIDV1,
    // },
    created_by: INTEGER,
    updated_by: INTEGER,
  });

  User.associate = () => {
    User.belongsToMany(app.model.Role, {
      through: {
        model: app.model.RoleUser,
        unique: false,
      },
      foreignKey: 'user_id',
    });
    User.hasMany(app.model.Token);
  };

  return User;
};
