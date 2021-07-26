'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    receiverId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    NotifyLabelId: DataTypes.INTEGER,
    isRead: DataTypes.BOOLEAN
  }, {})
  Notification.associate = function (models) {
    Notification.belongsTo(models.NotifyLabel)
    Notification.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender'
    })
    Notification.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'receiver'
    })
  }
  return Notification
}
