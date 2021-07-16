'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Chatroom = sequelize.define('Chatroom', {
    roomName: DataTypes.STRING,
  }, {});
  Chatroom.associate = function (models) {
    // Chatroom.belongsToMany(models.User, {
    //   through: models.UserRoom,
    //   foreignKey: 'UserId',
    //   as: 'Chatrooms'
    // })
    Chatroom.belongsToMany(models.User, {
      through: models.UserRoom,
      foreignKey: 'ChatroomId',
      as: 'Users'
    })
  };
  return Chatroom;
};