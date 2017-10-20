/*
 * @Author: MUHM
 * @Date: 2017-10-20 10:28:11
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-20 10:29:13
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const Setting = app.model.define('setting', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    key: STRING(150),
    value: TEXT,
    type: STRING(150),
  });

  return Setting;
};
