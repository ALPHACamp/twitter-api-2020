'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    isDeleted: DataTypes.BOOLEAN
  }, {
    tableName: 'Likes'
  })
  Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignKey: 'UserId' })
    Like.belongsTo(models.Tweet, { foreignKey: 'TweetId', as: "LikedTweet" })
  }
  return Like
}