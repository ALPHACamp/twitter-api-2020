'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER,
      Content: DataTypes.TEXT
    },
    {}
  )
  Message.associate = function (models) {
    Message.belongsTo(models.User)
    Message.belongsTo(models.Room)
  }
  return Message
}
