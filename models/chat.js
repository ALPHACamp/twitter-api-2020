'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    chatMessage: DataTypes.TEXT,
    UserId: DataTypes.INTEGER
  }, {});
  Chat.associate = function (models) {
    // associations can be defined here
    Chat.belongsTo(models.User)
  };
  return Chat;
};