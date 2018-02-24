# goodluck

[goodluck api 文档][goodluck_api]。

采用egg.js作为程序主框架，参见 [egg 文档][egg]。  

采用mysql作为数据存储，使用sequelizejs作为orm框架，参见[sequelize 文档][sequelize]。  

页面渲染采用nunjucks，参见[nunjucks][nunjucks]。 

### 本地开发

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
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。


[egg]: https://eggjs.org
[Sequelize]:http://docs.sequelizejs.com
[nunjucks]:http://mozilla.github.io/nunjucks/api.html
[goodluck_api]: /api.md
