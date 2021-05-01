'use strict'
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {})
  Room.associate = function (models) {
    Room.hasMany(models.Chat)
    Room.belongsToMany(models.User, {
      through: models.RoomRecord,
      foreignKey: 'RoomId',
      as: 'roomUsers'
    })
  }
  return Room
}
