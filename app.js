/*
 * @Author: MUHM
 * @Date: 2017-09-22 17:12:06
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-20 14:28:24
 */
'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    app.locals.moment = require('moment');

    const password_secret = 'goodluck'; // 请勿二次修改
    const password_default = 'zaqzxc';
    await app.model.sync({ force: app.config.setup });
    if (app.config.setup) {
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
        key: 'cdn',
        value: app.config.cdn || null,
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
        value: '为你的所爱而来，为你的发现停留',
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
          url: '/api/permission/menu',
          method: 'get',
          area: 'api',
          controller: 'permission',
          action: 'menu',
          sort: 1001,
          is_menu: 0,
          created_by: admin.id,
          updated_by: admin.id,
        });
      });

      await role.createPermission({
        name: '博客管理',
        url: '#',
        icon: 'fa-wordpress',
        sort: 70,
        is_menu: 1,
        created_by: admin.id,
        updated_by: admin.id,
      }).then(async result => {
        await role.createPermission({
          parent_id: result.id,
          name: '文章管理',
          url: '/manage/post',
          method: 'get',
          area: 'manage',
          controller: 'post',
          action: 'index',
          icon: 'fa-newspaper-o',
          sort: 7010,
          is_menu: 1,
          created_by: admin.id,
          updated_by: admin.id,
        }).then(async result => {
          await role.createPermission({
            parent_id: result.id,
            name: '文章列表',
            description: '文章列表数据',
            url: '/api/post',
            method: 'get',
            area: 'api',
            controller: 'post',
            action: 'index',
            sort: 7011,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '文章具体信息',
            description: '文章具体信息数据',
            url: '/api/post/:id',
            method: 'get',
            area: 'api',
            controller: 'post',
            action: 'show',
            sort: 7012,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '文章编辑页面',
            description: '文章编辑页面',
            url: '/manage/post/upsert/:id',
            method: 'get',
            area: 'manage',
            controller: 'post',
            action: 'upsert',
            sort: 7013,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '文章编辑',
            description: '文章编辑',
            url: '/api/post',
            method: 'post',
            area: 'api',
            controller: 'post',
            action: 'upsert',
            sort: 7013,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '文章删除',
            description: '文章删除',
            url: '/api/post/:id',
            method: 'delete',
            area: 'api',
            controller: 'post',
            action: 'destroy',
            sort: 7015,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '图片上传',
            description: '图片上传',
            url: '/api/image',
            method: 'post',
            area: 'api',
            controller: 'image',
            action: 'create',
            sort: 7099,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
        });
        await role.createPermission({
          parent_id: result.id,
          name: '标签管理',
          url: '/manage/tag',
          method: 'get',
          area: 'manage',
          controller: 'tag',
          action: 'index',
          icon: 'fa-tag',
          sort: 7020,
          is_menu: 1,
          created_by: admin.id,
          updated_by: admin.id,
        }).then(async result => {
          await role.createPermission({
            parent_id: result.id,
            name: '标签列表',
            description: '标签列表数据',
            url: '/api/tag',
            method: 'get',
            area: 'api',
            controller: 'tag',
            action: 'index',
            sort: 7021,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '标签具体信息',
            description: '标签具体信息数据',
            url: '/api/tag/:id',
            method: 'get',
            area: 'api',
            controller: 'tag',
            action: 'show',
            sort: 7022,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '标签新增',
            description: '标签新增',
            url: '/api/tag',
            method: 'post',
            area: 'api',
            controller: 'tag',
            action: 'create',
            sort: 7023,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '标签修改',
            description: '标签修改',
            url: '/api/tag',
            method: 'put',
            area: 'api',
            controller: 'tag',
            action: 'update',
            sort: 7024,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '标签删除',
            description: '标签删除',
            url: '/api/tag/:id',
            method: 'delete',
            area: 'api',
            controller: 'tag',
            action: 'destroy',
            sort: 7025,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
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
            url: '/api/user',
            method: 'get',
            area: 'api',
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
            url: '/api/user/:id',
            method: 'get',
            area: 'api',
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
            description: '用户新增',
            url: '/api/user',
            method: 'post',
            area: 'api',
            controller: 'user',
            action: 'create',
            sort: 8013,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '用户修改',
            description: '用户修改',
            url: '/api/user',
            method: 'put',
            area: 'api',
            controller: 'user',
            action: 'update',
            sort: 8014,
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
            url: '/api/role',
            method: 'get',
            area: 'api',
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
            url: '/api/role/:id',
            method: 'get',
            area: 'api',
            controller: 'role',
            action: 'show',
            sort: 8022,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '角色新增',
            description: '角色新增',
            url: '/api/role',
            method: 'post',
            area: 'api',
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
            description: '角色修改',
            url: '/api/role',
            method: 'put',
            area: 'api',
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
            description: '角色删除',
            url: '/api/role/:id',
            method: 'delete',
            area: 'api',
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
            url: '/api/permission',
            method: 'get',
            area: 'api',
            controller: 'permission',
            action: 'index',
            sort: 8026,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
        });
        await role.createPermission({
          parent_id: result.id,
          name: '网站管理',
          url: '/manage/site',
          method: 'get',
          area: 'manage',
          controller: 'site',
          action: 'index',
          icon: 'fa-dashboard',
          sort: 8030,
          is_menu: 1,
          created_by: admin.id,
          updated_by: admin.id,
        }).then(async result => {
          await role.createPermission({
            parent_id: result.id,
            name: '网站管理',
            description: '网站管理数据',
            url: '/api/site',
            method: 'get',
            area: 'api',
            controller: 'site',
            action: 'index',
            sort: 8031,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '网站具体信息',
            description: '网站具体信息数据',
            url: '/api/site/:id',
            method: 'get',
            area: 'api',
            controller: 'site',
            action: 'show',
            sort: 8032,
            is_menu: 0,
            created_by: admin.id,
            updated_by: admin.id,
          });
          await role.createPermission({
            parent_id: result.id,
            name: '网站修改',
            description: '网站修改',
            url: '/api/site',
            method: 'put',
            area: 'api',
            controller: 'site',
            action: 'update',
            sort: 8034,
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
    if (app.locals.cdn) {
      app.locals.web_assets = app.locals.cdn + app.locals.web_assets;
      app.locals.manage_assets = app.locals.cdn + app.locals.manage_assets;
    }
  });
};
