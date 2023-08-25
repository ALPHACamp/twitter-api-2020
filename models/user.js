'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    avatar: DataTypes.STRING,
    banner: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })

  User.associate = function (models) {
    User.hasMany(models.Tweet, {
      foreignKey: 'UserId'
    })
    User.hasMany(models.Reply, {
      foreignKey: 'UserId'
    })
    User.hasMany(models.Like, {
      foreignKey: 'UserId'
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
    User.hasMany(models.Followship, {
      foreignKey: 'followerId'
    })
    User.hasMany(models.Followship, {
      foreignKey: 'followingId'
    })
  }
  return User
}
