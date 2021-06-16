'use strict'
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    senderId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    titleData: DataTypes.STRING,
    url: DataTypes.STRING,
    type: DataTypes.STRING,
    contentData: DataTypes.STRING
  }, {})
  Notification.associate = function (models) {
    // associations can be defined here
    Notification.belongsTo(models.User, {
      foreignKey: 'senderId'
    })
  }
  return Notification
}
