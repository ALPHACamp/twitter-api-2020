'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      UserId: DataTypes.INTEGER,
      receiverId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
      ReplyId: DataTypes.INTEGER,
      type: DataTypes.INTEGER
    },
    {
      tableName: 'Notifications'
    }
  )
  Notification.associate = function (models) {
    // associations can be defined here
    Notification.belongsTo(models.User, { foreignKey: 'UserId' })
    Notification.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    Notification.belongsTo(models.Reply, { foreignKey: 'ReplyId' })
  }
  return Notification
}
