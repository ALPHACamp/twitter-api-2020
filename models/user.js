'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
  }, {
    account: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    introduction: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://i.imgur.com/q6bwDGO.png'
    },
    cover: {
      type: DataTypes.STRING,
      defaultValue: 'https://i.imgur.com/1jDf2Me.png'
    },
    tweetCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    modelName: 'User',
    tableName: 'Users'
  })
  User.associate = function (models) {
  }
  return User
}
