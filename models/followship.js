'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate (models) {
      // Relation(s)
      Followship.belongsTo(models.User, { foreignKey: 'followerId', as: 'Followers' })
      Followship.belongsTo(models.User, { foreignKey: 'followingId', as: 'Followings' })
    }
  }
  Followship.init({
    // field: DataTypes.TYPE
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })
  return Followship
}
