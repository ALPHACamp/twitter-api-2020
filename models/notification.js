'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    senderId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    messageData: DataTypes.STRING
  }, {})
  Notification.associate = function (models) {
    // associations can be defined here
  }
  return Notification
}
