'use strict'
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    time: DataTypes.STRING
  }, {})
  Chat.associate = function(models) {
    // associations can be defined here
    Chat.belongsTo(models.User)
  }
  return Chat
}
