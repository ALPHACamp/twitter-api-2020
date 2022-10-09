'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate (models) {
      Like.belongsTo(models.User, { foreignKey: 'UserId' })
      Like.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
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
      tableName: 'Likes',
      modelName: 'Like'
    }
  )
  return Like
}
