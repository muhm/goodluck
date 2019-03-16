/*
 * @Author: MUHM
 * @Date: 2019-03-15 18:05:55
 * @Last Modified by: MUHM
 * @Last Modified time: 2019-03-15 21:37:58
 */
/*
 * @Author: MUHM
 * @Date: 2018-01-12 13:37:22
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-27 16:17:56
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
