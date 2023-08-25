'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Reply extends Model { }

  Reply.associate = function (models) {
    Reply.belongsTo(models.User, { foreignKey: 'UserId', as: 'Author' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }

  Reply.init({
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: false
  })

  return Reply
}
