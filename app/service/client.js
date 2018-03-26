/*
 * @Author: MUHM
 * @Date: 2017-10-12 16:23:18
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-26 16:33:56
 */
'use strict';

module.exports = app => {
  return class Client extends app.Service {
    /**
     * @param  {String} uuid - uuid
     * @param  {String} secret - secret
     * @return {Promise} Client
     */
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
