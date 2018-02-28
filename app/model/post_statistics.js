/*
 * @Author: MUHM
 * @Date: 2018-02-28 10:37:29
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-28 14:37:09
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const PostStatistics = app.model.define('post_statistics', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    comment:{
      type: INTEGER,
      defaultValue: 0,
      comment: '评论数'
    },
    hit: {
      type: INTEGER,
      defaultValue: 0,
      comment: '点击数'
    },
    like: {
      type: INTEGER,
      defaultValue: 0,
      comment: 'like'
    },
    fuck: {
      type: INTEGER,
      defaultValue: 0,
      comment: 'dislike'
    },
  });

  return PostStatistics;
};
