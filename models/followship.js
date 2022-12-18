'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate(models) {
      Followship.belongsTo(models.User, { foreignKey: 'followerId', as: 'Followers' })
      Followship.belongsTo(models.User, { foreignKey: 'followingId', as: 'Followings' })
    }
  }
  Followship.init({
    // Model attributes are defined here
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Followship', // We need to choose the model name
    tableName: 'Followships',
    underscored: true
  })
  return Followship
}
