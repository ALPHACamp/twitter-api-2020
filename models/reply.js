'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    modelName: 'Reply',
    tableName: 'Replies'
  })
  Reply.associate = function (models) {
    Reply.belongsTo(models.User, { foreignKey: 'UserId' })
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
  }
  return Reply
}
