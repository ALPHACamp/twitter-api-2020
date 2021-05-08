'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TweetId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ReplyId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
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
