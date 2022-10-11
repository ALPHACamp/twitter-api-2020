'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate (models) {
    }
  };
  Followship.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    followingId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Followship',
    tableName: 'Followships',
    underscored: true
  })
  return Followship
}
