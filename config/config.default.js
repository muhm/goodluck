/*
 * @Author: MUHM
 * @Date: 2017-10-20 09:51:35
 * @Last Modified by: MUHM
 * @Last Modified time: 2019-03-15 16:42:09
 */
'use strict';

module.exports = appInfo => {
  const config = {};
  // should change to your own
  config.keys = appInfo.name + '_1499319408248_7916';
  // session
  config.session = {
    key: 'glhf',
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
    encrypt: true,
  };
  // 页面模版
  config.view = {
    defaultViewEngine: 'nunjucks',
  };
  config.nunjucks = {
    cache: true,
  };
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
    username: '***',
    password: '***',
    database: '***',
    host: '***',
    port: 8888, // 3306/1433
    dialect: '****', // mysql/mssql
    force: false,
    timezone: '+08:00',
    // logging: false,
  };
  config.security = {
    csrf: {
      ignore: /^\/api\/open\/.*$/,
    },
  };
  config.middleware = ['authClient'];
  config.authClient = {
    match: /^\/api\/open\/.*$/,
  };
  config.alinode = {
    enable: false,
    appid: 'xxxx',
    secret: 'xxxxx',
  };
  config.onerror = {
    json(err, ctx) {
      ctx.body = {
        code: ctx.status,
        msg: err.message,
      };
    },
  };
  config.cos = {
    AppId: 'xxxxxxx',
    SecretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    SecretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  };
  config.setup = true; // 请在写入数据库后修改为false
  config.password_secret = 'goodluck';
  config.password_default = 'zaqzxc';
  return config;
};
