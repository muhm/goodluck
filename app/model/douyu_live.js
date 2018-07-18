/*
 * @Author: MUHM
 * @Date: 2018-07-10 13:45:44
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-07-10 13:45:44
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const DouyuLive = app.model.define('douyu_live', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    hn: {
      type: INTEGER,
      comment: '在线热度值',
    },
    nickname: {
      type: STRING(128),
      comment: '在线热度值',
    },
    online: {
      type: INTEGER,
      comment: '原人气字段，现在与热度值同步(后续可能会依据情况废弃该字段)',
    },
    owner_uid: {
      type: STRING(128),
      comment: '房间所属用户的 UID',
    },
    room_id: {
      type: INTEGER,
      comment: '房间 ID',
    },
    room_name: {
      type: STRING(128),
      comment: '房间名称',
    },
    room_src: {
      type: STRING(1024),
      comment: '房间图片',
    },
    url: {
      type: STRING(1024),
      comment: 'url',
    },
    face: {
      type: TEXT,
      comment: '腾讯优图',
    },
    max_beauty: {
      type: INTEGER,
      comment: '魅力[0~100]',
    },
  });

  return DouyuLive;
};
