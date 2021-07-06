'use strict';
module.exports = (sequelize, DataTypes) => {
  const PrivateRoom = sequelize.define('PrivateRoom', {
    RoomId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  PrivateRoom.associate = function (models) {
    PrivateRoom.belongsTo(models.User)
    PrivateRoom.hasMany(models.PrivateMessage)
  };
  return PrivateRoom;
};