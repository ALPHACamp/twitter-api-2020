'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    targetChannel: DataTypes.STRING,
    type: DataTypes.STRING,
    sendTo: DataTypes.INTEGER,
    isRead: { type: DataTypes.BOOLEAN, defaultValue: 0 }
  }, {})
  Message.associate = function (models) {
    Message.belongsTo(models.User)
  }
  return Message
}
