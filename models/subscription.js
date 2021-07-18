'use strict'
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    UserId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER
  }, {})
  Subscription.associate = function (models) {
    Subscription.belongsTo(models.User)
  }
  return Subscription
};
