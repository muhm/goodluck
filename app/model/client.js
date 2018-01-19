/*
 * @Author: MUHM
 * @Date: 2017-09-13 16:01:34
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-18 13:56:32
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, UUID, UUIDV1 } = app.Sequelize;

  const Client = app.model.define('client', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    uuid: {
      type: UUID,
      defaultValue: UUIDV1,
    },
    name: {
      type: STRING(32),
      comment: '客户端显示名',
    },
    secret: {
      type: STRING(32),
      comment: '客户端密钥',
    },
    redirection_uri: {
      type: STRING(1000),
      comment: '返回地址',
    },
    logo: {
      type: STRING(1000),
      comment: 'logo',
    },
    type: {
      type: STRING(32),
      comment: '类型',
    },
    description: {
      type: STRING(1000),
      comment: '描述',
    },
    access_token_lifetime: {
      type: INTEGER,
      comment: '访问令牌的生存期，单位是秒',
    },
    refresh_token_lifetime: {
      type: INTEGER,
      comment: '更新令牌的最大生存期，单位是秒',
    },
    created_by: INTEGER,
    updated_by: INTEGER,
    deleted_by: INTEGER,
  });

  Client.associate = () => {
    Client.hasMany(app.model.Token);
  };

  return Client;
};
