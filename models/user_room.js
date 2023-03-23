'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_Room = sequelize.define('User_Room', {
    UserId: DataTypes.INTEGER,
    RoomId: DataTypes.INTEGER
  }, {});
  User_Room.associate = function(models) {
    // associations can be defined here
  };
  return User_Room;
};