/*
 * @Author: MUHM
 * @Date: 2017-10-12 16:23:18
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-24 19:09:56
 */
'use strict';

module.exports = app => {
  return class Client extends app.Service {
    /**
     * @param  {String} uuid
     * @param  {String} secret
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
