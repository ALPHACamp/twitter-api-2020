'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate (models) {
      Room.belongsTo(models.User, { foreignKey: 'userOneId' })
      Room.belongsTo(models.User, { foreignKey: 'userTwoId' })
    }
  }
  Room.init(
    {
      userOneId: DataTypes.INTEGER,
      userTwoId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Room',
      tableName: 'Rooms'
    }
  )
  return Room
}
