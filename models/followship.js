'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class FollowShip extends Model {
    static associate (models) {
    }
  }
  FollowShip.init({
    // Model attributes are defined here
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'FollowShip', // We need to choose the model name
    tableName: 'FollowShips',
    underscored: true
  })
  return FollowShip
}
