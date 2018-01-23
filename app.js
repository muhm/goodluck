/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:12:06
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-23 13:52:41
 */
'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    app.locals.moment = require('moment');

    // setup begin 发布后请自行删除
    const setup = false;
    const password_secret = 'goodluck'; // 请勿二次修改
    const password_default = 'zaqzxc'; // 请勿二次修改
    if (setup) {
      await app.model.sync({ force: true });
      // 设置初始参数
      await app.model.Setting.bulkCreate([{
        key: 'version',
        value: '1.0.0',
        type: 'core',
      }, {
        key: 'copyright',
        value: 'Copyright © 2018 by GoodLuck',
        type: 'core',
      }, {
        key: 'web_assets',
        value: '/public/web',
        type: 'core',
      }, {
        key: 'manage_assets',
        value: '/public/manage',
        type: 'core',
      }, {
        key: 'password_secret',
        value: password_secret,
        type: 'core',
      }, {
        key: 'password_default',
        value: password_default,
        type: 'core',
      }, {
        key: 'login_fail_max',
        value: '3',
        type: 'core',
      }, {
        key: 'title',
        value: 'GoodLuck',
        type: 'web',
      }, {
        key: 'description',
        value: '',
        type: 'web',
      }, {
        key: 'keywords',
        value: 'glhf,gl,hf,goodluck,muhm,ghostnova,ghost,nova',
        type: 'web',
      }]);
      // 设置测试client
      await app.model.Client.create({
        uuid: '4d014be0-af29-11e7-8094-33e8f708f39e',
        name: '测试',
        secret: '123456',
        access_token_lifetime: 86400000,
        refresh_token_lifetime: 86400000,
      });
      const crypto = require('crypto');
      // 设置管理员
      const admin = await app.model.User.create({
        name: 'admin',
        truename: '管理员',
        password: crypto.createHash('md5').update(`123456${password_secret}`).digest('hex'),
        status: 1,
      });
      // 设置初始权限
      const role = await admin.createRole({
        name: 'Administrator',
        description: 'Administrators',
        created_by: admin.id,
        updated_by: admin.id,
      });
      await role.createPermission({
        name: '后台首页',
        description: '后台首页',
        url: '/manage/home',
        method: 'get',
        area: 'manage',
        controller: 'home',
        action: 'index',
        icon: 'fa-home',
        sort: 0,
        is_menu: 1,
        created_by: admin.id,
        updated_by: admin.id,
      }).then(async result => {
        await role.createPermission({
          parent_id: result.id,
          name: '用户菜单',
          description: '用户菜单数据',
          url: '/manage/api/menu',
          method: 'get',
          area: 'manage.api',
          controller: 'menu',
          action: 'index',
          sort: 1001,
          is_menu: 0,
          created_by: admin.id,
          updated_by: admin.id,
        });
      });

      await role.createPermission({
        name: '系统管理',
        url: '#',
        icon: 'fa-cog',
        sort: 80,
        is_menu: 1,
        created_by: admin.id,
        updated_by: admin.id,
      }).then(async result => {
        await role.createPermission({
          parent_id: result.id,
          name: '用户管理',
          url: '/manage/user',
          method: 'get',
          area: 'manage',
          controller: 'user',
          action: 'index',
          icon: 'fa-user',
          sort: 8010,
          is_menu: 1,
          created_by: admin.id,
          updated_by: admin.id,
        }).then(async result => {
          await role.createPermission({
            parent_id: result.id,
            name: '用户列表',
            description: '用户列表数据',
            url: '/manage/api/user',
            method: 'get',
            area: 'manage.api',
            controller: 'user',
            action: 'index',
            sort: 8011,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '用户具体信息',
            description: '用户具体信息数据',
            url: '/manage/api/user/:id',
            method: 'get',
            area: 'manage.api',
            controller: 'user',
            action: 'show',
            sort: 8012,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '用户新增',
            description: '用户列表数据',
            url: '/manage/api/user',
            method: 'post',
            area: 'manage.api',
            controller: 'user',
            action: 'create',
            sort: 8013,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
        });
        await role.createPermission({
          parent_id: result.id,
          name: '角色管理',
          url: '/manage/role',
          method: 'get',
          area: 'manage',
          controller: 'role',
          action: 'index',
          icon: 'fa-legal',
          sort: 8020,
          is_menu: 1,
          created_by: admin.id,
          updated_by: admin.id,
        }).then(async result => {
          await role.createPermission({
            parent_id: result.id,
            name: '角色列表',
            description: '角色列表数据',
            url: '/manage/api/role',
            method: 'get',
            area: 'manage.api',
            controller: 'role',
            action: 'index',
            sort: 8021,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '角色具体信息',
            description: '角色具体信息数据',
            url: '/manage/api/role/:id',
            method: 'get',
            area: 'manage.api',
            controller: 'role',
            action: 'show',
            sort: 8023,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '角色新增',
            description: '角色列表数据',
            url: '/manage/api/role',
            method: 'post',
            area: 'manage.api',
            controller: 'role',
            action: 'create',
            sort: 8023,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '角色修改',
            description: '角色列表数据',
            url: '/manage/api/role',
            method: 'put',
            area: 'manage.api',
            controller: 'role',
            action: 'update',
            sort: 8024,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '角色删除',
            description: '角色列表数据',
            url: '/manage/api/role/:id',
            method: 'del',
            area: 'manage.api',
            controller: 'role',
            action: 'destroy',
            sort: 8025,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '权限列表',
            description: '权限列表数据',
            url: '/manage/api/permission',
            method: 'get',
            area: 'manage.api',
            controller: 'permission',
            action: 'index',
            sort: 8026,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
        });
      });
    }
    // setup end
    const config = await app.model.Setting.findAll();
    if (config) {
      config.forEach(element => {
        app.locals[element.key] = element.value;
      }, this);
    }
  });
};
