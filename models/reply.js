'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class XXXX extends Model {
    static associate (models) {
      // Relation(Two Example below)
      // User.hasMany(models.Reply, { foreignKey: 'UserId' })
      // User.belongsToMany(models.User, {
      //   through: models.Followship,
      //   foreignKey: 'followerId',
      //   as: 'Followings'
      // })
    }
  }
  XXXX.init({
    // field: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'XXXX',
    tableName: 'XXXXs'
  })
  return XXXX
}
