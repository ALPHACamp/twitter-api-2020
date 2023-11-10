'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      User.hasMany(models.Like, { foreignKey: 'UserId' })
      User.belongsToMany(models.Tweet, {
        through: models.Like,
        foreignKey: 'UserId',
        as: 'LikedTweets'
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
  User.init(
    {
      name: DataTypes.STRING,
      account: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      cover: DataTypes.STRING,
      role: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users'
    }
  )
  return User
}
