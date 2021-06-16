'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    UserId: DataTypes.INTEGER,
  }, {});
  Chat.associate = function (models) {
    Chat.belongsTo(models.User)
  };
  return Chat;
};