'use strict'
module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    'ChatRoom',
    {
      isPublic: DataTypes.BOOLEAN
    },
    {}
  )
  ChatRoom.associate = function (models) {
    ChatRoom.hasMany(models.JoinRoom)
    ChatRoom.hasMany(models.Message)
  }
  return ChatRoom
}
