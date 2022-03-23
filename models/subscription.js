'use strict'
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    'Subscription',
    {
      subscriberId: DataTypes.INTEGER,
      subscribingId: DataTypes.INTEGER
    },
    {
      tableName: 'Subscriptions'
    }
  )
  Subscription.associate = function (models) {
    // associations can be defined here
  }
  return Subscription
}
