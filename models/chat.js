'use strict'
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    RoomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {})
  Chat.associate = function (models) {
    Chat.belongsTo(models.User)
  }
  return Chat
}
