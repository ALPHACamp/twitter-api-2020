'use strict'
module.exports = (sequelize, DataTypes) => {
  const JoinRoom = sequelize.define(
    'JoinRoom',
    {
      UserId: DataTypes.INTEGER
    },
    {}
  )
  JoinRoom.associate = function (models) {
    JoinRoom.belongsTo(models.User)
    JoinRoom.belongsTo(models.ChatRoom)
  }
  return JoinRoom
}
