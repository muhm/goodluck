/*
 * @Author: MUHM
 * @Date: 2018-07-11 15:29:36
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-07-18 15:17:14
 */
'use strict';
module.exports = app => {
  return {
    schedule: {
      interval: '5m',
      type: 'worker',
      disable: true,
    },
    async task(ctx) {
      try {
        const list = await ctx.model.DouyuLive.findAll();
        for (const i in list) {
          if (/default/.test(list[i].room_src) || list.max_beauty) {
            continue;
          }
          // let image_url = list[i].room_src;
          // if (/small/.test(image_url)) {
          //   image_url.replace('small', 'big');
          // }
          // if (/big/.test(image_url)) {
          //   image_url.replace('big', 'small');
          // }
          const isExist = await ctx.model.DouyuLive.findOne({ where: { room_src: list[i].room_src, max_beauty: { $ne: null } }, paranoid: false });
          if (isExist) {
            list[i].update({ max_beauty: isExist.max_beauty, face: isExist.face });
          } else {
            const res = await ctx.curl(list[i].room_src);
            if (res.status !== 200) {
              continue;
            }
            const bitmap = res.data;
            const imageData = {
              app_id: app.config.qqai.AppID,
              time_stamp: parseInt(Date.now() / 1000),
              nonce_str: parseInt(Math.random() * Math.pow(2, 32)).toString(),
              mode: 0,
              image: bitmap.toString('base64'),
            };
            imageData.sign = ctx.helper.qqaiSign(imageData, app.config.qqai.AppKey);
            const result = await ctx.curl('https://api.ai.qq.com/fcgi-bin/face/face_detectface', {
              method: 'POST',
              data: imageData,
              dataType: 'json',
            });
            if (result.data.ret === 0) {
              let max_beauty = 0;
              result.data.data.face_list.forEach(element => {
                if (element.beauty > max_beauty) {
                  max_beauty = element.beauty;
                }
              });
              list[i].update({ max_beauty, face: JSON.stringify(result.data.data) });
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
  };
};
