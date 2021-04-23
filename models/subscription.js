'use strict'
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    'Subscription',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      subscriberId: DataTypes.INTEGER,
      authorId: DataTypes.INTEGER
    },
    {}
  )
  Subscription.associate = function (models) {}
  return Subscription
}
