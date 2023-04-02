'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.hasMany(models.Like, { foreignKey: 'UserId' })
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId', // 自己的id要出現在followingId欄位
        as: 'Followers' // 可用User.Followers -> 取出在follow自己的人
      })
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId', // 自己的id要出現在followingId欄位
        as: 'Followings' // 可用User.Followings -> 取出在follow自己的人
      })
    }
  };
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    account: DataTypes.STRING,
    avatar: DataTypes.STRING,
    cover: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  })
  return User
}
