/*
 * @Author: MUHM
 * @Date: 2017-09-13 16:02:35
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-02-28 16:05:42
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, TEXT, DATE, UUID, UUIDV1 } = app.Sequelize;

  const Post = app.model.define('post', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV1,
    },
    slug: {
      unique: true,
      type: STRING(150),
    },
    title: STRING(150),
    markdown: TEXT,
    mobiledoc: TEXT,
    html: TEXT,
    featured: INTEGER,
    image: TEXT,
    status: INTEGER,
    meta_title: STRING(150),
    meta_description: STRING(150),
    author_id: INTEGER,
    created_by: INTEGER,
    updated_by: INTEGER,
    published_at: DATE,
    published_by: INTEGER,
  });

  Post.associate = () => {
    Post.belongsTo(app.model.User, { as: 'author', foreignKey: 'author_id', targetKey: 'id' });
    Post.belongsToMany(app.model.Tag, {
      through: {
        model: app.model.PostTag,
        unique: false,
      },
      foreignKey: 'post_id',
    });

    Post.hasOne(app.model.PostStatistics);
  };

  return Post;
};
