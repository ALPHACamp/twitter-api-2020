'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    cover: DataTypes.STRING,
    account: DataTypes.STRING,
    followingCount: DataTypes.INTEGER,
    followerCount: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Reply)
    User.hasMany(models.Tweet)
    User.hasMany(models.Like)
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.hasMany(models.Message)
    User.belongsToMany(User, {
      through: models.Subscription,
      foreignKey: 'subscriberId',
      as: 'recipient'
    })
    User.belongsToMany(User, {
      through: models.Subscription,
      foreignKey: 'recipientId',
      as: 'subscriber'
    })
    User.belongsToMany(models.Room, {
      through: models.Member,
      foreignKey: 'UserId',
      as: 'RoomsOfUser'
    })
    User.belongsToMany(User, {
      through: models.Notification,
      foreignKey: 'receiverId',
      as: 'sender'
    })
    User.belongsToMany(User, {
      through: models.Notification,
      foreignKey: 'senderId',
      as: 'receiver'
    })
  };
  return User;
};