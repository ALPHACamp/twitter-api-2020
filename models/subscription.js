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
      subscriberId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  )
  Subscription.associate = function (models) {}
  return Subscription
}
