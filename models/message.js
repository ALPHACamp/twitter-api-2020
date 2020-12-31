'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    targetChannel: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, {})
  Message.associate = function (models) {
    Message.belongsTo(models.User)
  }
  return Message
}
