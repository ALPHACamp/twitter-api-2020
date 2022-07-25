'use strict'
const {  Model} = require('sequelize')
// const like = require('./like')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Tweet)
      User.hasMany(models.Reply)
      User.hasMany(models.Like)
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreinerKey: 'followerId',
        as: 'followings'
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreinerKey: 'followingId',
        as: 'followers'
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
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
};