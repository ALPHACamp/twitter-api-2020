'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    modelName: 'Reply',
    tableName: 'Replies'
  })
  Reply.associate = function (models) {
  }
  return Reply
}
