'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  })
  Like.associate = function (models) {
    Like.belongsTo(models.User, { foreignkey: 'UserId' })
    Like.belongsTo(models.Tweet, { foreignkey: 'TweetId' })
  }
  return Like
}
