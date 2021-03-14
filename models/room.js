'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: DataTypes.STRING
  }, {});
  Room.associate = function (models) {
    Room.hasMany(models.PrivateMessage)
  };
  return Room;
};