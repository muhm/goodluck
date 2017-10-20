/*
 * @Author: MUHM
 * @Date: 2017-10-20 09:51:35
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-20 09:52:31
 */
'use strict';

module.exports = appInfo => {
  const config = {};
  // should change to your own
  config.keys = appInfo.name + '_1499319408248_7916';
  // sequelize
  config.sequelize = {
    define: {
      underscored: true,
      freezeTableName: true,
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: true,
      timezone: '+08:00',
    },
    username: 'gl_dev',
    password: 'zaq12wsx',
    database: 'gl_dev',
    host: 'ie.gl',
    port: 3306,
    dialect: 'mysql',
    force: false,
    timezone: '+08:00',
    logging: false,
  };
  config.security = {
    csrf: {
      enable: false,
    },
  };
  config.middleware = ['authClinet'];
  config.authClinet = {
    match: /^\/api\/v1\/.*$/,
  };
  config.i18n = {
    defaultLocale: 'zh-CN',
  };

  return config;
};
