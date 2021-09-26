'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notification.belongsTo(models.Subscribeship)
      Notification.belongsTo(models.Tweet)
      Notification.belongsTo(models.Reply)
      Notification.belongsTo(models.Like)
      Notification.belongsTo(models.Followship)
      Notification.belongsTo(models.User, {
        through: models.Notification,
        foreignKey: 'triggerId',
        as: 'Trigger'
      })
      Notification.belongsTo(models.User, {
        through: models.Notification,
        foreignKey: 'targetId',
        as: 'Target'
      })
    }
  };
  Notification.init({
    triggerId: DataTypes.INTEGER,
    targetId: DataTypes.INTEGER,
    TweetId: DataTypes.INTEGER,
    ReplyId: DataTypes.INTEGER,
    FollowshipId: DataTypes.INTEGER,
    SubscribeshipId: DataTypes.INTEGER,
    LikeId: DataTypes.INTEGER,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};