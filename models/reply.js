'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    static associate(models) {
      Reply.belongsTo(models.User, { foreignKey: 'userId' })
      Reply.belongsTo(models.Tweet, { foreignKey: 'tweetId' })
    }
  }
  Reply.init({
    comment: DataTypes.TEXT,
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies', // 別忘了這行
    underscored: true
  })
  return Reply
}