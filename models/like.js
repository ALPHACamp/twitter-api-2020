'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.STRING,
    tweetId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes',
  })
  Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }
  return Like
}