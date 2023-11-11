'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate (models) {
    }
  }
  Followship.init(
    {
      followerId: DataTypes.INTEGER,
      followingId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Followship',
      tableName: 'Followships'
    }
  )
  return Followship
}
