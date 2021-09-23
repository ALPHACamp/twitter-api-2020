'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User)
      Message.belongsTo(models.Room)
    }
  }
  Message.init(
    {
      content: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Message'
    }
  )
  return Message
}
