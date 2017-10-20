/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:12:06
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-20 15:03:41
 */
'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    app.locals.moment = require('moment');
    // setup begin 发布后请自行删除
    // await app.model.sync({ force: true });
    // await app.model.Clinet.create({
    //   uuid: '4d014be0-af29-11e7-8094-33e8f708f39e',
    //   name: '测试',
    //   secret: '123456',
    //   access_token_lifetime: 86400000,
    //   refresh_token_lifetime: 86400000,
    // });
    // const crypto = require('crypto');
    // await app.model.User.create({
    //   name: 'admin',
    //   truename: '管理员',
    //   password: crypto.createHash('md5').update('admin' + 'goodluck').digest('hex'),
    //   status:'active',
    // });
    // const setting = [{
    //   key: 'title',
    //   value: 'GoodLuck',
    //   type: 'web',
    // }, {
    //   key: 'description',
    //   value: '',
    //   type: 'web',
    // }, {
    //   key: 'password_secret',
    //   value: 'goodluck',
    //   type: 'core',
    // }, {
    //   key: 'version',
    //   value: '1.0.0',
    //   type: 'core',
    // }, {
    //   key: 'copyright',
    //   value: 'copyright',
    //   type: 'core',
    // }, {
    //   key: 'login_fail_max',
    //   value: '3',
    //   type: 'core',
    // }];
    // await app.model.Setting.bulkCreate(setting);
    // setup end 
    // const config = new Map();
    const config = await app.model.Setting.findAll();
    if (config) {
      config.forEach(element => {
        app.locals[element.key] = element.value;
      }, this);
    }
    // 如果不需要UTC时间请开启
    Date.prototype.toJSON = () => {
      return app.locals.moment(this).format('YYYY-MM-DD HH:mm:ss');
    }
  });
};
