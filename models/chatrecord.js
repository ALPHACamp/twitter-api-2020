'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChatRecord = sequelize.define('ChatRecord', {
    roomId: DataTypes.INTEGER,
    speakerId: DataTypes.INTEGER,
    chatContent: DataTypes.TEXT
  }, {});
  ChatRecord.associate = function(models) {
    ChatRecord.belongsTo(models.Chatmate, {
      foreignKey: 'roomId',
      as: 'records'
    })
  };
  return ChatRecord;
};