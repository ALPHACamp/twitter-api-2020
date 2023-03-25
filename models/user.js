'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Reply, {
        foreignKey: 'UserId'
      })
      User.hasMany(models.Tweet, {
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
    }
  }
  User.init({
    name: DataTypes.STRING(50),
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    account: DataTypes.STRING,
    avatar: DataTypes.STRING,
    coverPage: DataTypes.STRING,
    role: DataTypes.STRING,
    introduction: DataTypes.TEXT(160)
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  })
  return User
}
