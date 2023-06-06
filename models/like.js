'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Like.init(
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      isLike: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes'
    }
  )
  return Like
}
