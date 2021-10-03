
'use strict';

const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(189),
      unique: true
    },
    password: DataTypes.STRING(189),
    name: DataTypes.STRING(189),
    avatar: DataTypes.STRING(189),
    introduction: DataTypes.TEXT,
    account: {
      type: DataTypes.STRING(189),
      unique: true
    },
    cover: DataTypes.STRING(189),
    role: {
      type: DataTypes.STRING(189),
      defaultValue: 'user'
    }
  }, {
    hooks: {
      beforeCreate: async (User, next) => {
        const password = User.dataValues.password
        if (password) {
          try {
            const salt = await bcrypt.genSalt(10)
            User.dataValues.password = await bcrypt.hash(password, salt)
          }
          catch (error) {
            console.log(error)
          }
        }
      },
      beforeUpdate: async (User, next) => {
        const password = User.dataValues.password
        if (password) {
          try {
            const salt = await bcrypt.genSalt(10)
            User.dataValues.password = await bcrypt.hash(password, salt)
          }
          catch (error) {
            console.log(error)
          }
        }
      }
    }
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Tweet, {
      foreignKey: 'UserId',
      as: 'userTweets'
    })
    User.hasMany(models.Reply, {
      foreignKey: 'UserId',
      as: 'replies'
    })
    User.hasMany(models.Followship, {
      foreignKey: 'followerId',
      as: 'following'
    })
    User.hasMany(models.Followship, {
      foreignKey: 'followingId',
      as: 'follower'
    })
    User.hasMany(models.Like, {
      foreignKey: 'UserId',
      as: 'likes'
    })
    User.hasMany(models.PublicChat, {
      foreignKey: 'speakerId',
      as: 'userChat'
    })
    User.hasMany(models.ChatRecord, {
      foreignKey: 'speakerId',
      as: 'userPrivateChat'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followerId',
      as: 'Followings'
    })
    User.belongsToMany(models.User, {
      through: models.Followship,
      foreignKey: 'followingId',
      as: 'Followers'
    })
  };
  return User;
};