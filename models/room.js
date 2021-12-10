'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    creater: DataTypes.INTEGER,
    listener: DataTypes.INTEGER
  }, {});
  Room.associate = function (models) {
    Room.hasMany(models.Message)
  };
  return Room;
};