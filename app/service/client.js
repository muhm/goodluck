/*
 * @Author: MUHM
 * @Date: 2017-10-12 16:23:18
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-19 17:29:39
 */
'use strict';

module.exports = app => {
  return class Client extends app.Service {
    // find by id
    findById(id) {
      return this.ctx.model.Client.findById(id);
    }
    // find by uuid
    findByUuid(uuid) {
      return this.ctx.model.Client.findOne({
        where: {
          uuid,
        },
      });
    }
    // find by uuid and secret
    findByUuidAndSecret(uuid, secret) {
      return this.ctx.model.Client.findOne({
        where: {
          uuid,
          secret,
        },
      });
    }
  };
};
