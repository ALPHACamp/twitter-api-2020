'use strict'
const { Model } = require('sequelize')
// const like = require('./like')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Tweet)
      User.hasMany(models.Reply)
      User.hasMany(models.Like)
      User.hasMany(models.Message)
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      User.belongsToMany(User, {
        through: models.Notify,
        foreignKey: 'notiSbj',
        as: 'NotiObjs'
      })
      User.belongsToMany(User, {
        through: models.Notify,
        foreignKey: 'notiObj',
        as: 'NotiSbjs'
      })
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING,
    account: DataTypes.STRING,
    banner: DataTypes.STRING,
    followersNum: DataTypes.INTEGER,
    tweetsNum: DataTypes.INTEGER,
    repliesNum: DataTypes.INTEGER,
    likesNum: DataTypes.INTEGER,
    socketId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
};