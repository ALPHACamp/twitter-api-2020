'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    roomName: DataTypes.STRING
  }, {});
  Room.associate = function(models) {
    // associations can be defined here
    Room.belongsToMany(models.User, {
      through: models.Member,
      foreignKey: 'RoomId',
      as: 'UsersInRoom'
    })
  };
  return Room;
};