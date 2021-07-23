'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    receiverId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    NotifyLabelId: DataTypes.INTEGER
  }, {})
  Notification.associate = function (models) {
    Notification.belongsTo(models.NotifyLabel)
  }
  return Notification
}
