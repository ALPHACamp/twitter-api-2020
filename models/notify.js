'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notify = sequelize.define('Notify', {
    userId: DataTypes.INTEGER,
    tweetId: DataTypes.INTEGER,
    followingId: DataTypes.STRING,
    likerId: DataTypes.STRING,
    replierId: DataTypes.STRING,
    readStatus: DataTypes.BOOLEAN
  }, {});
  Notify.associate = function (models) {
    Notify.belongsTo(models.User)
    Notify.belongsTo(models.Tweet)
  };
  return Notify;
};