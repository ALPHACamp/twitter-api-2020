'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate (models) {
      Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
      Reply.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Reply.init(
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Reply',
      tableName: 'Replies'
    }
  )
  return Reply
}
