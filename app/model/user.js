/*
 * @Author: MUHM
 * @Date: 2017-07-06 13:48:11
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-27 17:03:21
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, UUID, UUIDV1 } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    name: {
      unique: true,
      allowNull: false,
      type: STRING(200),
      comment: '账号',
    },
    truename: {
      type: STRING(200),
      comment: '姓名',
    },
    password: {
      type: STRING(60),
      comment: '密码',
    },
    email: {
      type: STRING(200),
      validate: {
        isEmail: true,
      },
      comment: '电子邮箱',
    },
    is_verify_email: {
      type: INTEGER,
      defaultValue: 0,
      comment: '电子邮箱是否认证：1-认证',
    },
    mobile: {
      type: STRING(20),
      comment: '手机号码',
    },
    is_verify_mobile: {
      type: INTEGER,
      defaultValue: 0,
      comment: '手机号码是否认证：1-认证',
    },
    status: {
      type: INTEGER,
      comment: '状态：1-正常',
    },
    last_login: {
      type: DATE,
      comment: '上次登录时间',
    },
    login_count: {
      type: INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: '登录次数',
    },
    login_fail_count: {
      type: INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: '连续密码错误次数',
    },
    register_ip: {
      type: STRING(32),
      comment: 'IP',
    },
    session_token: {
      type: UUID,
      defaultValue: UUIDV1,
      comment: '登录凭证',
    },
    created_by: {
      type: INTEGER,
      comment: '创建人',
    },
    updated_by: {
      type: INTEGER,
      comment: '最后修改人',
    },
    deleted_by: {
      type: INTEGER,
      comment: '注销人',
    },
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
