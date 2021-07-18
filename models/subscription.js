'use strict'
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    subscriberId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER
  }, {})
  Subscription.associate = function (models) {
  }
  return Subscription
};
