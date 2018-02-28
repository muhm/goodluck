/*
 * @Author: MUHM
 * @Date: 2017-10-13 16:30:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-28 10:37:38
 */
'use strict';

module.exports = app => {
  const { INTEGER } = app.Sequelize;

  const PostTag = app.model.define('post_tag', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    post_id: INTEGER,
    tag_id: INTEGER,
  });

  return PostTag;
};
