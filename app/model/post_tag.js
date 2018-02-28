/*
 * @Author: MUHM
 * @Date: 2017-10-13 16:30:53
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-28 16:06:30
 */
'use strict';

module.exports = app => {
  const { INTEGER, UUID } = app.Sequelize;

  const PostTag = app.model.define('post_tag', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    post_id: {
      type: UUID,
    },
    tag_id: {
      type: UUID,
    },
  });

  return PostTag;
};
