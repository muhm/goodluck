/*
 * @Author: MUHM
 * @Date: 2017-08-11 10:14:06
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-10 18:45:39
 */
'use strict';

const path = require('path');
const fs = require('fs');
const uuid = require('node-uuid');
const sendToWormhole = require('stream-wormhole');
const COS = require('cos-nodejs-sdk-v5');
module.exports = app => {
  class ImageController extends app.Controller {
    async create() {
      const { ctx } = this;
      const stream = await ctx.getFileStream();
      const time = ctx.locals.moment().format('YYYYMMDD');
      const fileFormat = (stream.filename).split('.');
      const ownFile = `public/files/images/${ctx.locals.user.id}`;
      const file = path.join(app.config.baseDir, `app/${ownFile}`);
      const userFile = path.join(file, time);
      const name = `${uuid.v1()}.${fileFormat[fileFormat.length - 1]}`;
      const filepath = path.join(userFile, `${name}`);
      try {
        await mkdirFile(file);
        await mkdirFile(userFile);
        await saveStream(stream, filepath);
      } catch (e) {
        // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
        await sendToWormhole(stream);
        ctx.body = {
          code: 500,
          msg: e.message,
          success: 0, // 0 表示上传失败，1 表示上传成功
          message: e.message,
        };
        return;
      }
      try {
        if (app.locals.cdn) {
          const data = await sliceUploadFile(`/${ownFile}/${time}/${name}`, filepath, app.config.cos)
          console.log(data);
        }
        ctx.body = {
          code: 200,
          // data: `${app.locals.cdn ? app.locals.cdn : ''}/${ownFile}/${time}/${name}`,
          msg: ctx.__('Success'),
          success: 1, // 0 表示上传失败，1 表示上传成功
          message: ctx.__('Success'),
          url: `${app.locals.cdn ? app.locals.cdn : ''}/${ownFile}/${time}/${name}`,
        };
      } catch (e) {
        ctx.body = {
          code: 500,
          msg: e.message,
          success: 0, // 0 表示上传失败，1 表示上传成功
          message: e.message,
        };
        return;
      }
    }
  }
  return ImageController;
};

function saveStream(stream, filepath) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(filepath);
    stream.pipe(ws);
    ws.on('error', reject);
    ws.on('finish', resolve);
  });
}

function mkdirFile(path) {
  return new Promise((resolve, reject) => {
    fs.exists(path, exists => {
      if (exists) {
        resolve(true);
      } else {
        fs.mkdir(path, err => {
          if (err) {
            reject(err);
          }
          resolve(true);
        });
      }
    });
  });
}

function sliceUploadFile(key, filepath, config) {
  return new Promise((resolve, reject) => {
    const cos = new COS(config);
    cos.sliceUploadFile({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: key,
      FilePath: filepath,
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
