'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {}
  Reply.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies'
  })

  Reply.associate = function (models) {
    Reply.belongsTo(models.User, {
      foreignKey: 'UserId'
    })
    Reply.belongsTo(models.Tweet, {
      foreignKey: 'TweetId'
    })
  }
  return Reply
}
