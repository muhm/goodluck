/*
 * @Author: MUHM
 * @Date: 2018-02-23 13:56:23
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-23 13:56:47
 */
'use strict';

module.exports = app => {
  class TagController extends app.Controller {
    async index() {
      const { ctx } = this;
      ctx.locals.breadcrumbs = [{
        title: ctx.__('Tag Management'),
      }];
      await ctx.render('manage/tag/index');
    }
  }

  return TagController;
};
