'use strict'
module.exports = (sequelize, DataTypes) => {
  const UnreadChat = sequelize.define('UnreadChat', {
    UserId: DataTypes.INTEGER,
    ChatId: DataTypes.INTEGER,
    channel: DataTypes.STRING
  }, {})
  UnreadChat.associate = function (models) {
    // associations can be defined here
    UnreadChat.belongsTo(models.User)
    UnreadChat.belongsTo(models.Chat)
  }
  return UnreadChat
}