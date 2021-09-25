'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChatRecord = sequelize.define('ChatRecord', {
    roomId: DataTypes.INTEGER,
    speakerId: DataTypes.INTEGER,
    chatContent: DataTypes.TEXT
  }, {});
  ChatRecord.associate = function(models) {
    // associations can be defined here
  };
  return ChatRecord;
};