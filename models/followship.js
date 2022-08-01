'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate (models) {}
  }
  Followship.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    followerId: new Date(),
    followingId: new Date()
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })
  return Followship
}
