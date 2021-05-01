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
    // associations can be defined here
    Notify.belongsTo(models.User)
    Notify.belongsTo(models.Tweet)
    Notify.belongsTo(models.Like)
    Notify.belongsTo(models.Followship)
    Notify.belongsTo(models.Reply)
  };
  return Notify;
};