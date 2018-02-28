/*
 * @Author: MUHM
 * @Date: 2018-02-28 10:37:29
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-28 13:25:49
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const PostComment = app.model.define('post_comment', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    content: {
      type: TEXT,
      comment: '内容',
    },
    ip: {
      type: STRING(32),
      comment: 'IP',
    },
    client_uuid: {
      type: STRING(32),
      comment: 'client_uuid',
    },
    user_id: {
      type: INTEGER,
      comment: '用户编号',
    },
    email: {
      type: STRING(200),
      validate: {
        isEmail: true,
      },
      comment: '电子邮箱',
    },
  });

  return PostComment;
};
