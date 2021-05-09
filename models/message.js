'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  )
  Message.associate = function (models) {
    Message.belongsTo(models.User)
    Message.belongsTo(models.ChatRoom)
  }
  return Message
}
