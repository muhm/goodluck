/*
 * @Author: MUHM
 * @Date: 2018-07-10 13:45:39
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-07-18 15:20:11
 */
'use strict';
module.exports = () => {
  return {
    schedule: {
      interval: '30m',
      type: 'worker',
      disable: true,
    },
    async task(ctx) {
      try {
        let data = [];
        const limit = 99;
        let offset = 0;
        let end = false;
        while (end) {
          const result = await ctx.curl(`http://open.douyucdn.cn/api/RoomApi/live/201?limit=${limit}&offset=${offset}`, { dataType: 'json' });
          if (result.status === 200) {
            data = data.concat(result.data.data);
            offset += limit;
          } else {
            end = true;
          }
        }
        await ctx.model.DouyuLive.destroy({ where: { id: { $ne: 0 } } });
        await ctx.model.DouyuLive.bulkCreate(data);
      } catch (e) {
        console.log(e);
      }
    },
  };
};
