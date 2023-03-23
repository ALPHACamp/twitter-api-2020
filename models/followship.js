'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate (models) {
      // define association here
      Followship.belongsTo(models.User, { foreignKey: 'followerId', as: 'Follower' })
      Followship.belongsTo(models.User, { foreignKey: 'followingId', as: 'Following' })
    }
  }

  Followship.init({
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships',
    underscored: true
  })

  return Followship
}
