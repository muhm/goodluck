/*
 * @Author: MUHM
 * @Date: 2017-10-12 16:23:18
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-01-18 13:56:36
 */
'use strict';

module.exports = app => {
  return class Client extends app.Service {
    // find by id
    async findById(id) {
      return await this.ctx.model.Client.findById(id);
    }
    // find by uuid
    async findByUuid(uuid) {
      return await this.ctx.model.Client.findOne({
        where: {
          uuid,
        },
      });
    }
    // find by uuid and secret
    async findByUuidAndSecret(uuid, secret) {
      return await this.ctx.model.Client.findOne({
        where: {
          uuid,
          secret,
        },
      });
    }
  };
};
