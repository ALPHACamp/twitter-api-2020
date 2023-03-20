'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Followship extends Model {
    static associate (models) {
      Followship.belongsTo(models.User, { foreignKey: 'UserId' })
      Followship.belongsTo(models.Tweet, { foreignKey: 'TweetId' })
    }
  };
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
