'use strict'
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'Reply',
    {
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      comment: DataTypes.TEXT
    },
    {
      tableName: 'Replies'
    }
  )
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Reply.belongsTo(models.User, { foreignKey: 'UserId' })
    Reply.hasMany(models.Notification, { foreignKey: 'TweetId' })
  }
  return Reply
}
