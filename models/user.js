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
    bio: {
      type: DataTypes.TEXT
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
  };
  return User;
};