'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Reply',
    tableName: 'Replies'
  })
  Reply.associate = function (models) {
    Reply.belongsTo(models.User, { foreignkey: 'UserId' })
    Reply.belongsTo(models.Tweet, { foreignkey: 'TweetId' })
  }
  return Reply
}
