'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      UserId: DataTypes.INTEGER,
      message: DataTypes.STRING
    },
    {}
  )
  Message.associate = function (models) {
    Message.belongsTo(models.User)
    Message.belongsTo(models.ChatRoom)
  }
  return Message
}
