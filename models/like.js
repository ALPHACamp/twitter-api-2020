'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {}
  Like.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes'
  })

  Like.associate = function (models) {
    Like.belongsTo(models.User, {
      foreignKey: 'UserId'
    })
    Like.belongsTo(models.Tweet, {
      foreignKey: 'TweetId'
    })
  }
  return Like
}
