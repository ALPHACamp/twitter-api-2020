'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
  }, {})
  Like.associate = function (models) {
  }

  Like.init({
    id: {
      field: 'id',
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
    underscored: false
  })

  return Like
}
