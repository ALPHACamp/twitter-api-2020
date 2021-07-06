'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateMessage = sequelize.define('PrivateMessage', {
    RoomId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    message: DataTypes.STRING
  }, {});
  PrivateMessage.associate = function (models) {
    PrivateMessage.belongsTo(models.Room)
    PrivateMessage.belongsTo(models.PrivateRoom)
  };
  return PrivateMessage;
}; 