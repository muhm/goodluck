/*
 * @Author: MUHM
 * @Date: 2017-09-13 16:02:35
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-13 16:33:19
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Token = app.model.define('token', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    access_token: STRING(32),
    access_token_expires_at: DATE,
    refresh_token: STRING(32),
    refresh_token_expires_at: DATE,
  });

  return Token;
};
