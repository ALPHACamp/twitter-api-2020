'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.hasMany(models.Member)
      Room.hasMany(models.Message)
    }
  }
  Room.init(
    {
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Room'
    }
  )
  return Room
}
