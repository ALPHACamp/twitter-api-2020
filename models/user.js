'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type:  DataTypes.STRING,
    },
    password: {
      type:  DataTypes.STRING,
    },
    name: {
      type:  DataTypes.STRING,
    },
    avatar: {
      type:  DataTypes.STRING
    },
    introduction: {
      type:  DataTypes.TEXT
    },
    role: {
      type:  DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    account: {
      type:  DataTypes.STRING,
    },
    cover: {
      type:  DataTypes.STRING
    },
    followerCount: {
      type:  DataTypes.INTEGER,
      defaultValue: 0
    },
    followingCount: {
      type:  DataTypes.INTEGER,
      defaultValue: 0
    },
    tweetCount: {
      type:  DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {})
  User.associate = function (models) {
    User.hasMany(models.Tweet)
    User.hasMany(models.Reply)
    User.hasMany(models.Like)
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
  }
  return User
}