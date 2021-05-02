'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      UserId: DataTypes.INTEGER,
      otherUserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      ReplyId: DataTypes.INTEGER,
      type: DataTypes.INTEGER
    },
    {}
  )
  Notification.associate = function (models) {
    Notification.belongsTo(models.User)
    Notification.belongsTo(models.Tweet)
    Notification.belongsTo(models.Reply)
  }
  return Notification
}
