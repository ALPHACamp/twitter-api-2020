'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate (models) { }
  }
  Followship.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })
  return Followship
}
