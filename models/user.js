'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    account: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING
    },
    introduction: {
      type: DataTypes.TEXT
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'normal'
    },
    followingCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followerCounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.hasMany(models.Message, {
      foreignKey: 'senderId'
    })
    User.hasMany(models.Message, {
      foreignKey: 'receiverId'
    })
    User.hasMany(models.Followship, {
      foreignKey: 'followingId'
    })
    User.hasMany(models.Followship, {
      foreignKey: 'followerId'
    })
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
    User.belongsToMany(User, {
      through: models.Message,
      foreignKey: 'senderId',
      as: 'Receivers'
    })
    User.belongsToMany(User, {
      through: models.Message,
      foreignKey: 'receiverId',
      as: 'Senders'
    })
  };
  return User;
};