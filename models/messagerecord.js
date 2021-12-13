'use strict';
module.exports = (sequelize, DataTypes) => {
  const MessageRecord = sequelize.define('MessageRecord', {
    SenderId: DataTypes.INTEGER,
    ReceiverId: DataTypes.INTEGER,
    RoomId: DataTypes.INTEGER,
    unreadNum: DataTypes.INTEGER,
    isSeen: DataTypes.BOOLEAN
  }, {});
  MessageRecord.associate = function(models) {
        MessageRecord.belongsTo(models.User, {
          foreignKey: 'SenderId',
          as: 'Sender'
        })
        MessageRecord.belongsTo(models.User, {
          foreignKey: 'ReceiverId',
          as: 'Receiver'
        })
        MessageRecord.belongsTo(models.Room)
  };
  return MessageRecord;
};