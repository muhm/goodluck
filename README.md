# Good Luck

[goodluck api 文档][goodluck_api]。

采用egg.js作为程序主框架，参见 [egg 文档][egg]。  

采用mysql作为数据存储，使用sequelizejs作为orm框架，参见[sequelize 文档][sequelize]。  

页面渲染采用nunjucks，参见[nunjucks][nunjucks]。 

### DEMO

https://ie.gl

后台:https://ie.gl/manage/home

账号:admin

密码:123456

### 本地开发

```
// config.default.js
config.setup = true; // 请在写入数据库后修改为false
```

```bash
$ npm i
$ npm run dev
$ open http://127.0.0.1:7001/
```

### 部署

线上正式环境用 `EGG_SERVER_ENV=prod` 来启动。

可以在config文件夹下新增config.prod.js来覆盖config.default.js中的数据库、加密等配置

```bash
$ EGG_SERVER_ENV=prod npm start
```

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。


[egg]: https://eggjs.org
[Sequelize]:http://docs.sequelizejs.com
[nunjucks]:http://mozilla.github.io/nunjucks/api.html
[goodluck_api]: /api.md
