'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate(models) {
      Followship.belongsTo(models.User, { foreignKey: 'followingId', as: 'Followers' })
      Followship.belongsTo(models.User, { foreignKey: 'followerId', as: 'Followings' })
    }
  };
  Followship.init({
    followingId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships'
  })
  return Followship
}
