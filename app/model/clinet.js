/*
 * @Author: MUHM
 * @Date: 2017-09-13 16:01:34
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 15:54:06
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, UUID, UUIDV1 } = app.Sequelize;

  const Clinet = app.model.define('clinet', {
    // 唯一的客户编号
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    uuid: {
      type: UUID,
      defaultValue: UUIDV1,
    },
    // 客户端显示名
    name: STRING(32),
    // 客户端密钥
    secret: STRING(32),
    // 返回地址
    redirection_uri: STRING(1000),
    // logo
    logo: STRING(1000),
    // 类型
    type: STRING(32),
    // 描述
    description: STRING(1000),
    // 访问令牌的生存期，单位是秒。
    access_token_lifetime: INTEGER,
    // 更新令牌的最大生存期，单位是秒。
    refresh_token_lifetime: INTEGER,
    created_by: INTEGER,
    updated_by: INTEGER,
    deleted_by: INTEGER,
  });

  Clinet.associate = () => {
    Clinet.hasMany(app.model.Token);
  };

  return Clinet;
};
