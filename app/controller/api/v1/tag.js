/*
 * @Author: MUHM
 * @Date: 2017-10-20 16:41:24
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-12-11 13:41:07
 */
'use strict';

module.exports = app => {
  class TagController extends app.Controller {
    async create() {
      const { ctx } = this;
      ctx.body = ctx.locals.moment();
    }
  }
  return TagController;
};
