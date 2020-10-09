'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    userId: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {});
  Chat.associate = function(models) {
    // associations can be defined here
  };
  return Chat;
};