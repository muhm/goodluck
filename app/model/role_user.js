/*
 * @Author: MUHM
 * @Date: 2017-07-06 13:48:11
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 13:58:27
 */
'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const RoleUser = app.model.define('role_user', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    role_id: INTEGER,
    user_id: INTEGER,
  });

  return RoleUser;
};
