'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    UserId: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {});
  Chat.associate = function (models) {
    Chat.belongsTo(models.User)
  };
  return Chat;
};