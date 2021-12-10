'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    text: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER,
    RoomId: DataTypes.INTEGER
  }, {});
  Message.associate = function (models) {
    Message.belongsTo(models.Room)
    Message.belongsTo(models.User)
  };
  return Message;
};