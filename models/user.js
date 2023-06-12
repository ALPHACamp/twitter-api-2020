'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Reply, { foreignKey: 'userId' })
      User.hasMany(models.Tweet, { foreignKey: 'userId' })
      User.hasMany(models.Like, { foreignKey: 'userId' })
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
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      account: DataTypes.STRING,
      role: DataTypes.STRING,
      avatar: DataTypes.STRING,
      cover: DataTypes.STRING,
      introduction: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      underscored: true
    }
  )
  return User
}
