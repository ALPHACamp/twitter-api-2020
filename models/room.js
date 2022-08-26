'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    User1Id: DataTypes.INTEGER,
    User2Id: DataTypes.INTEGER,
    User1Unread: DataTypes.BOOLEAN,
    User1UnreadNum: DataTypes.INTEGER,
    User2Unread: DataTypes.BOOLEAN,
    User2UnreadNum: DataTypes.INTEGER
  }, {});
  Room.associate = function (models) {
    // associations can be defined here
  };
  return Room;
};