'use strict';
module.exports = (sequelize, DataTypes) => {
  const PublicChat = sequelize.define('PublicChat', {
    speakerId: DataTypes.INTEGER,
    chatContent: DataTypes.STRING(189)
  }, {});
  PublicChat.associate = function(models) {
    PublicChat.belongsTo(models.User, {
      foreignKey: 'speakerId',
      as: 'user'
    })
  };
  return PublicChat;
};