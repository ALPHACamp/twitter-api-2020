'use strict'
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    'Room',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      isPublic: DataTypes.BOOLEAN
    },
    {}
  )
  Room.associate = function (models) {
    Room.hasMany(models.Message)
    Room.hasMany(models.Participant)
  }
  return Room
}
