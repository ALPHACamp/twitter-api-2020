'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    modelName: 'Like',
    tableName: 'Likes'
  })
  Like.associate = function (models) {
  }
  return Like
}
