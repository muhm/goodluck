/*
 * @Author: MUHM
 * @Date: 2017-10-12 16:23:18
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-20 09:38:58
 */
'use strict';

module.exports = app => {
  return class Clinet extends app.Service {
    // find by id
    async findById(id) {
      return await this.ctx.model.Clinet.findById(id);
    }
    // find by uuid
    async findByUuid(uuid) {
      return await this.ctx.model.Clinet.findOne({
        where: {
          uuid,
        },
      });
    }
    // find by uuid and secret
    async findByUuidAndSecret(uuid, secret) {
      return await this.ctx.model.Clinet.findOne({
        where: {
          uuid,
          secret,
        },
      });
    }
  };
};
