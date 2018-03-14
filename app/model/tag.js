/*
 * @Author: MUHM
 * @Date: 2017-09-13 16:02:35
 * @Last Modified by: MUHM
 * @Last Modified time: 2018-03-14 13:36:16
 */
'use strict';

module.exports = app => {
  const { STRING, INTEGER, TEXT, UUID, UUIDV1 } = app.Sequelize;

  const Tag = app.model.define('tag', {
    id: {
      primaryKey: true,
      type: UUID,
      defaultValue: UUIDV1,
    },
    slug: {
      unique: true,
      type: STRING(150),
    },
    name: {
      type: STRING(150),
    },
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
