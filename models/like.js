'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.Tweet)
      Like.belongsTo(models.User)
    }
  }
  Like.init(
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes',
      underscored: true,
    }
  )
  return Like
}
