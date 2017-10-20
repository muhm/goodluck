/*
 * @Author: MUHM
 * @Date: 2017-09-13 16:02:35
 * @Last Modified by: MUHM
 * @Last Modified time: 2017-10-13 16:33:37
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const Tag = app.model.define('tag', {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    slug: {
      unique: true,
      type: STRING(150),
    },
    name: STRING(150),
    description: STRING(200),
    image: TEXT,
    meta_title: STRING(150),
    meta_description: STRING(150),
    created_by: INTEGER,
    updated_by: INTEGER,
  });

  Tag.associate = () => {
    Tag.belongsToMany(app.model.Post, {
      through: {
        model: app.model.PostTag,
        unique: false,
      },
      foreignKey: 'tag_id',
    });
  };

  return Tag;
};
