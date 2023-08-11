'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Subscribe extends Model {
    static associate (models) {
      Subscribe.belongsTo(models.User, { as: 'Subscriber', foreignKey: 'fromUserId' })
      Subscribe.belongsTo(models.User, { as: 'Subscribe', foreignKey: 'toUserId' })
    }
  }
  Subscribe.init(
    {
      fromUserId: DataTypes.INTEGER,
      toUserId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Subscribe',
      tableName: 'Subscribes'
    }
  )
  return Subscribe
}
