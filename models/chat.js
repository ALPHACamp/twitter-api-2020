'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate (models) {
      Chat.belongsTo(models.User, { foreignKey: 'userId' })
      Chat.belongsTo(models.Room, { foreignKey: 'roomId' })
    }
  }
  Chat.init(
    {
      message: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER,
      timestamp: DataTypes.DATE // 訊息發送的時間
    },
    {
      sequelize,
      modelName: 'Chat',
      tableName: 'Chats'
    }
  )
  return Chat
}
