'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const UserRoom = sequelize.define('UserRoom', {
    UserId: DataTypes.INTEGER,
    ChatRoomId: DataTypes.TEXT
  }, {});
  UserRoom.associate = function (models) {

  };
  return UserRoom;
};