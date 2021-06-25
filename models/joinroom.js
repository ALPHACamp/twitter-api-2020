'use strict'
module.exports = (sequelize, DataTypes) => {
  const JoinRoom = sequelize.define(
    'JoinRoom',
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  )
  JoinRoom.associate = function (models) {
    JoinRoom.belongsTo(models.User)
    JoinRoom.belongsTo(models.ChatRoom)
  }
  return JoinRoom
}
