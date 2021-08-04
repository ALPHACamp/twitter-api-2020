'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    sender: DataTypes.INTEGER,
    receiver: DataTypes.INTEGER
  }, {});
  Room.associate = function(models) {
    // associations can be defined here
  };
  return Room;
};