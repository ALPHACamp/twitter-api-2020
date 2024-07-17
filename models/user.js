'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Tweet, { foreignKey: 'UserId' })
      User.hasMany(models.Reply, { foreignKey: 'UserId' })
      User.hasMany(models.Like, { foreignKey: 'UserId' })

      // the user's followers
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers'
      })
      // the user's followings
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings'
      })
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      role: DataTypes.STRING,
      account: DataTypes.STRING,
      cover: DataTypes.STRING
    },
    {
      sequelize, // We need to pass the connection instance
      modelName: 'User',
      tableName: 'Users'
    }
  )
  return User
}
