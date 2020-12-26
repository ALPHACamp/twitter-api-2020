'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    UserId: DataTypes.INTEGER
  }, {});
  Chat.associate = function (models) {
    Chat.hasMany(models.User)
  };
  return Chat;
};