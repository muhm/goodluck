/*
 * @Author: MUHM
 * @Date: 2018-02-24 16:34:25
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-24 16:34:49
 */
'use strict';

module.exports = app => {
  class SiteController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.locals.breadcrumbs = [{
        title: ctx.__('Site Management'),
      }];
      await ctx.render('manage/site/index');
    }
  }

  return SiteController;
};
