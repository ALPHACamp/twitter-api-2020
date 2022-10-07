'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate(models) {
      // define association here
    }
  };
  Followship.init({
    followerId: DataTypes.STRING,
    followingId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships',
    underscored: true
  })
  return Followship
}