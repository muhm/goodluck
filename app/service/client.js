/*
 * @Author: MUHM
 * @Date: 2017-10-12 16:23:18
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-19 17:26:36
 */
'use strict';

module.exports = app => {
  return class Client extends app.Service {
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
