/*
 * @Author: MUHM
 * @Date: 2019-03-15 18:05:55
 * @Last Modified by: MUHM
 * @Last Modified time: 2019-06-12 17:22:23
 */
'use strict';

module.exports = app => {
  class SiteController extends app.Controller {
    async index() {
      const { ctx } = this;
      const result = {
        code: 200,
        data: app.locals.site,
      };

      ctx.body = result;
    }
  }
  return SiteController;
};
