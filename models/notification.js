'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    senderId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    messageData: DataTypes.STRING,
    url: DataTypes.STRING
  }, {})
  Notification.associate = function (models) {
    // associations can be defined here
  }
  return Notification
}
