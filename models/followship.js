'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {}
  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })

  Followship.associate = function (models) {
    Followship.belongsTo(models.User, {
      foreignKey: 'followerId'
    })
    Followship.belongsTo(models.User, {
      foreignKey: 'followingId'
    })
  }
  return Followship
}
