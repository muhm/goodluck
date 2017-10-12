/*
 * @Author: MUHM
 * @Date: 2017-10-12 13:24:50
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-12 13:59:07
 */
'use strict';

module.exports = app => {
  class SystemController extends app.Controller {
    async time() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
    }
  }
  return SystemController;
};
