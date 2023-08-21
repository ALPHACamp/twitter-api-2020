'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Reply extends Model { }

  Reply.associate = function (models) {
    Reply.belongsTo(models.User, { foreignKey: 'userId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
  }

  Reply.init({
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies',
    underscored: false
  })

  return Reply
}
